<script lang="ts">
    import { onMount } from "svelte";
    import IconButton from "../components/IconButton.svelte";
    import FormGrouping from "../components/FormGrouping.svelte";
    import LabelSelect from "../components/LabelSelect.svelte";
    import { ChoiceData, hashSHA256, MinimapObjectType, ProjectMinimapObjectData, projectStore } from "../miscellaneous";
    import { LoadImage } from "../../wailsjs/go/main/Bridge";
    import LabelTextArea from "../components/LabelTextArea.svelte";
    import LabelTextInput from "../components/LabelTextInput.svelte";

    export let selectedStateID: string;
    export let selectedMinimapLocationID: string | undefined;
    export let selectedMinimapObjectID: string | undefined;

    async function loadMinimapImage() {
        const imageB64 = await LoadImage();
        if(imageB64.startsWith("Cancelled") === true) { return; }
        // Delete previous hash beforehand, then add new image
        const previousHash = $projectStore.storage.states.data[selectedStateID].locations.data[selectedMinimapLocationID].minimapHash;
        delete $projectStore.storage.images[previousHash];
        const imageHash = await hashSHA256(imageB64);
        $projectStore.storage.images[imageHash] = imageB64;
        $projectStore.storage.states.data[selectedStateID].locations.data[selectedMinimapLocationID].minimapHash = imageHash;

        $projectStore.storage.states = $projectStore.storage.states;
    }

    async function clearMinimapImage() {
        const previousHash = $projectStore.storage.states.data[selectedStateID].locations.data[selectedMinimapLocationID].minimapHash;
        delete $projectStore.storage.images[previousHash];
        $projectStore.storage.states.data[selectedStateID].locations.data[selectedMinimapLocationID].minimapHash = "";

        $projectStore.storage.states = $projectStore.storage.states;
    }

    const typeChoiceData: ChoiceData<MinimapObjectType>[] = [
        { key: "circle", display: "Circle", enabled: true },
        { key: "vector", display: "Vector", enabled: true },
    ];
    let objectsChoiceData: ChoiceData<string>[] = [];
    $: {
        // Allow selecting of no objects to only popup dialog
        $projectStore.storage.objects;
        objectsChoiceData = [
            { key: "", display: "", enabled: true},
            ...$projectStore.storage.objects.ordering
            .map(id => {
                const data = $projectStore.storage.objects.data[id];
                return { key: data.id, display: data.devName, enabled: true };
            }),
        ];
    }

    let canvas: HTMLCanvasElement;
    let canvasWidth: number;
    let canvasHeight: number;
    let context: CanvasRenderingContext2D;
    onMount(() => { context = canvas.getContext("2d") as CanvasRenderingContext2D; });
    $: {
        selectedStateID;
        selectedMinimapObjectID;
        $projectStore.storage.states.data[selectedStateID].locations;
        $projectStore.storage.states.data[selectedStateID].locations.data[selectedMinimapLocationID].minimapObjects.data[selectedMinimapObjectID];
        setTimeout(renderCanvas, 5); // Need setTimeout to force minimap render
    }

    let previousStateID: string;
    let previousMinimapObjectID: string;
    let renderType: MinimapObjectType;
    $: {
        // Small glitch - won't re-render minimap if import from this page
        selectedStateID;
        selectedMinimapObjectID;
        if(selectedMinimapObjectID !== undefined && $projectStore.storage.states.data[selectedStateID].locations.data[selectedMinimapLocationID].minimapObjects.data[selectedMinimapObjectID] !== undefined) { 
            $projectStore.storage.states.data[selectedStateID].locations.data[selectedMinimapLocationID].minimapObjects.data[selectedMinimapObjectID].type;

            // criteriaType for convenience since the binding is so long
            // Reset fields whenever criteria type changes with same criteria
            const newValue = $projectStore.storage.states.data[selectedStateID].locations.data[selectedMinimapLocationID].minimapObjects.data[selectedMinimapObjectID].type;
            if(renderType !== undefined && newValue !== undefined && renderType !== newValue
                && previousMinimapObjectID === selectedMinimapObjectID && previousStateID === selectedStateID) {
                    $projectStore.storage.states.data[selectedStateID].locations.data[selectedMinimapLocationID].minimapObjects.data[selectedMinimapObjectID].args = [];
                renderCanvas();
            }
            
            renderType = $projectStore.storage.states.data[selectedStateID].locations.data[selectedMinimapLocationID].minimapObjects.data[selectedMinimapObjectID].type;
            previousStateID = selectedStateID;
            previousMinimapObjectID = selectedMinimapObjectID;
        }
    }

    function constructColor(color: "red" | "green", alpha: number) {
        return `rgba(${color === "red"
            ? "255, 0, 0"
            : "0, 255, 0"}, ${alpha})`;
    }

    function renderMinimapObject(minimapObject: ProjectMinimapObjectData, color: "red" | "green", dotted: boolean = false) {
        // Render either oval or vector depending on type
        const boundingRect = canvas.getBoundingClientRect();
        context.strokeStyle = constructColor(color, 1);
        if(minimapObject.type === "vector") {
            // Iterate over points and draw line, then fill
            // Draw "dots" for each vector point first
            for(const [index, [ratioX, ratioY]] of minimapObject.args.entries()) {
                const coordX = Math.floor(ratioX * boundingRect.width);
                const coordY = Math.floor(ratioY * boundingRect.height);
                const path = new Path2D();
                path.arc(coordX, coordY, 2, 0, 2 * Math.PI);

                // Add an additional circle for the "finishing" point when selected
                if(index === 0 && color === "green") { 
                    path.arc(coordX, coordY, 4, 0, 2 * Math.PI);
                }

                context.stroke(path);
            }

            // Draw line beginning from starting point all the way back
            let starting = true;
            const path = new Path2D();
            for(const [ratioX, ratioY] of [...minimapObject.args, minimapObject.args[0]]) {
                const coordX = Math.floor(ratioX * boundingRect.width);
                const coordY = Math.floor(ratioY * boundingRect.height);
                
                // Move to initial point or draw line
                if(starting === true) {
                    starting = false;
                    path.moveTo(coordX, coordY);
                } else {
                    path.lineTo(coordX, coordY);
                }
            }

            // Reference to vector path
            context.fillStyle = constructColor(color, 0.2);
            context.lineWidth = 2;
            if(dotted === true) { context.setLineDash([5, 15]) }
            context.stroke(path);
            context.fill(path);
            context.setLineDash([]);
        } else { // if(minimapObject.type === "circle")
            // Center point should always be defined, radius not really
            let [[centerRatioX, centerRatioY], radiusPoint] = minimapObject.args as [[number, number], [number, number] | undefined];

            const path = new Path2D();
            const centerCoordX = Math.floor(centerRatioX * boundingRect.width);
            const centerCoordY = Math.floor(centerRatioY * boundingRect.height);
            if(radiusPoint === undefined) {
                // Radius not defined, only draw middle dot
                path.arc(centerCoordX, centerCoordY, 2, 0, 2 * Math.PI);
            } else {
                // Radius defined, draw entire circle with small middle dot
                path.arc(centerCoordX, centerCoordY, 1, 0, 2 * Math.PI);
                const radiusCoordX = Math.floor(radiusPoint[0] * boundingRect.width);
                const radiusCoordY = Math.floor(radiusPoint[1] * boundingRect.height);
                const radius = Math.sqrt(Math.pow(centerCoordX - radiusCoordX, 2) + Math.pow(centerCoordY - radiusCoordY, 2));
                path.arc(centerCoordX, centerCoordY, radius, 0, 2 * Math.PI);
            }

            // Reference to circle path
            context.fillStyle = constructColor(color, 0.2);
            context.lineWidth = 2;
            if(dotted === true) { context.setLineDash([5, 15]) }
            context.stroke(path);
            context.fill(path);
            context.setLineDash([]);
        }
    }

    function renderMinimapObjectWrapper(minimapObject: ProjectMinimapObjectData, color: "red" | "green") {
        // Can't render if there's nothing to render
        if(minimapObject.args[0] === undefined) { 
            return;
        }

        renderMinimapObject(minimapObject, color, false);
        if(color === "green") {
            // Dotted line around currently selected
            renderMinimapObject(minimapObject, color, true);
        }
    } 

    function renderCanvas(event?: MouseEvent) {
        // Context shouldn't be undefined but just in case
        if(context === undefined) { return; }

        // Clear the canvas before re-rendering
        context.clearRect(0, 0, canvas.width, canvas.height);

        // Only handle onclick if minimap object selected, and points are addable
        const current = $projectStore.storage.states.data[selectedStateID].locations.data[selectedMinimapLocationID].minimapObjects.data[selectedMinimapObjectID];
        if(event !== undefined && selectedMinimapObjectID !== undefined
            && (current.type === "vector" || (current.args[0] === undefined || current.args[1] === undefined))) {
            // Get position of mouse cursor on click, maintain as percentage
            const boundingRect = canvas.getBoundingClientRect();
            const ratioX = Math.max(Math.floor(event.clientX - boundingRect.left), 0) / boundingRect.width;
            const ratioY = Math.max(Math.floor(event.clientY - boundingRect.top), 0) / boundingRect.height;

            current.args.push([ratioX, ratioY]);
        }

        // Render normal objects first that aren't current selected
        for(const [minimapObjectID, minimapObject] of Object.entries($projectStore.storage.states.data[selectedStateID].locations.data[selectedMinimapLocationID].minimapObjects.data)) {
            if(minimapObjectID !== selectedMinimapObjectID) {
                renderMinimapObjectWrapper(minimapObject, "red");
            }
        }

        // Then, render the selected minimap object
        if(selectedMinimapObjectID !== undefined) {
            renderMinimapObjectWrapper(current, "green");
        }
    }

    function clearMinimapObjectRender() {
        $projectStore.storage.states.data[selectedStateID].locations.data[selectedMinimapLocationID].minimapObjects.data[selectedMinimapObjectID].args = [];
    }
</script>

<div class="flex flex-row space-x-4
    w-full h-full">
    <div class="flex flex-col space-y-4
        h-full" style="width: 55%">
        <FormGrouping>
            <svelte:fragment slot="header">
                <p class="text-slate-300 text-xl">Minimap</p>
                <div class="flex flex-row space-x-2">
                    <IconButton label={"Load Image"}
                        onclick={loadMinimapImage}>
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                        </svg>
                    </IconButton>
                    <IconButton label={"Clear Image"}
                        onclick={clearMinimapImage}>
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </IconButton>
                </div>
            </svelte:fragment>
            <svelte:fragment slot="content">
                <div class="border border-slate-600 
                    minimap-display">
                    {#if $projectStore.storage.states.data[selectedStateID].locations.data[selectedMinimapLocationID].minimapHash !== ""}
                        <img class="absolute h-full w-full object-contain"
                            style="z-index: 12"
                            src={$projectStore.storage.images[$projectStore.storage.states.data[selectedStateID].locations.data[selectedMinimapLocationID].minimapHash]} />
                    {/if}
                    <canvas class="absolute h-full w-full"
                        style="z-index: 14"
                        bind:this={canvas}
                        bind:clientWidth={canvasWidth}
                        bind:clientHeight={canvasHeight}
                        width={canvasWidth}
                        height={canvasHeight}
                        on:click={renderCanvas} />
                </div>
            </svelte:fragment>
        </FormGrouping>
        <FormGrouping class="grow">
            <svelte:fragment slot="content">
                <div class="flex flex-col items-center justify-center space-y-1
                    w-full h-full">
                    <p>Tip: To only show the popup dialog, don't assign a referenced object</p>
                </div>
            </svelte:fragment>
        </FormGrouping>
    </div>
    <div class="grow flex flex-col space-y-4">
        {#if selectedMinimapObjectID !== undefined}
            <FormGrouping class="grow">
                <svelte:fragment slot="header">
                    <p class="text-slate-300 text-xl">Selected Minimap Object</p>
                    <div class="flex flex-row space-x-2">
                        <IconButton label={"Clear"}
                            onclick={clearMinimapObjectRender}>
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </IconButton>
                    </div>
                </svelte:fragment>
                <svelte:fragment slot="content">
                    <LabelTextInput class="w-full"
                        bind:value={$projectStore.storage.states.data[selectedStateID].locations.data[selectedMinimapLocationID].minimapObjects.data[selectedMinimapObjectID].devName}
                        label={"Development Name"}
                        placeholder={"Knife on Table"} />
                    <LabelSelect class="w-1/2" 
                        label={"Render Type"} 
                        disabled={false}
                        choicesData={typeChoiceData}
                        bind:selected={$projectStore.storage.states.data[selectedStateID].locations.data[selectedMinimapLocationID].minimapObjects.data[selectedMinimapObjectID].type} />
                    <LabelSelect class="w-2/3" 
                        label={"Referenced Object"} 
                        disabled={false}
                        choicesData={objectsChoiceData}
                        bind:selected={$projectStore.storage.states.data[selectedStateID].locations.data[selectedMinimapLocationID].minimapObjects.data[selectedMinimapObjectID].object} />
                    <LabelTextArea class="w-full" 
                        bind:value={$projectStore.storage.states.data[selectedStateID].locations.data[selectedMinimapLocationID].minimapObjects.data[selectedMinimapObjectID].dialog} 
                        label={"Popup Dialog"}
                        placeholder={"You spy the key to your restraints resting on the floor, tauntingly just out of reach."}
                        rows={8} />
                </svelte:fragment>
            </FormGrouping>
        {/if}
    </div>
</div>

<style>
    .minimap-display {
        position: relative;
        width: 100%;
        height: 0;
        padding-bottom: 100%;
    }
</style>