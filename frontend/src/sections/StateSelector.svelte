<script lang="ts">
    import { ProjectStateData, idLength, projectStore, randomID, ScrollingRadioData } from "../miscellaneous";
    import FormGrouping from "../components/FormGrouping.svelte";
    import IconButton from "../components/IconButton.svelte";
    import ScrollingRadio from "../components/ScrollingRadio.svelte";
    import RadioState from "../components/RadioState.svelte";

    export let selectedStateID: string | undefined;
    
    let scrollingStateData: ScrollingRadioData[];
    function generateStateData(): ScrollingRadioData[] {
        return $projectStore.storage.states.ordering
            .filter(id => id !== undefined).map((id) => {
                const stateData = $projectStore.storage.states.data[id];
                return {
                    key: stateData.id,
                    component: RadioState,
                    props: { stateData: stateData }
                }
            });
    }
    $: {
        $projectStore.storage.states;
        scrollingStateData = generateStateData();
    }

    function addState() {
        const id = randomID(idLength);
        $projectStore.storage.states.data[id] = {
            id: id,
            title: "",
            description: "",
            notes: "",
            imageB64: "",
            type: "normal",
            args: [],
            hints: [
                { attempts: -1, text: "" },
                { attempts: -1, text: "" },
                { attempts: -1, text: "" },
                { attempts: -1, text: "" },
                { attempts: -1, text: "" },
            ],
            interactions: {
                data: {},
                ordering: [],
            },
            locations: {
                data: {},
                ordering: []
            }
        }
        $projectStore.storage.states.ordering.push(id);

        $projectStore.storage.states = $projectStore.storage.states;
    }

    function copyState() {
        if(selectedStateID !== undefined) {
            const selectedStateData = $projectStore.storage.states.data[selectedStateID];
            const copiedStateData: ProjectStateData = JSON.parse(JSON.stringify(selectedStateData));
            const copiedStateId = randomID(idLength);
            copiedStateData.id = copiedStateId;
            $projectStore.storage.states.data[copiedStateId] = copiedStateData;
            $projectStore.storage.states.ordering.push(copiedStateId);

            $projectStore.storage.states = $projectStore.storage.states;
        }
    }

    function deleteState() {
        if(selectedStateID !== undefined) {
            const backupStateID = selectedStateID;
            selectedStateID = undefined;

            // Modify ordering in-place (without "setting")
            const ordering = $projectStore.storage.states.ordering;
            const stateIndex = ordering.findIndex(id => id === backupStateID);
            for(let index = stateIndex; index < ordering.length - 1; index++) {
                ordering[index] = ordering[index + 1] ?? undefined;
            }
            ordering.pop();
            selectedStateID = ordering[stateIndex] ?? ordering[stateIndex-1];
            // Delete state data from project data
            delete $projectStore.storage.states.data[backupStateID];

            $projectStore.storage.states = $projectStore.storage.states;
        }
    }

    function moveStateUp() {
        if(selectedStateID !== undefined && $projectStore.storage.states.ordering.length > 1) {
            const ordering = $projectStore.storage.states.ordering;
            const stateIndex = ordering.findIndex(id => id === selectedStateID);
            if(stateIndex <= 0) { return; }
            const tempSwap = ordering[stateIndex];
            ordering[stateIndex] = ordering[stateIndex - 1]
            ordering[stateIndex - 1] = tempSwap;

            $projectStore.storage.states = $projectStore.storage.states;
        }
    }

    function moveStateDown() {
        if(selectedStateID !== undefined && $projectStore.storage.states.ordering.length > 1) {
            const ordering = $projectStore.storage.states.ordering;
            const stateIndex = ordering.findIndex(id => id === selectedStateID);
            if(stateIndex === -1 || stateIndex === $projectStore.storage.states.ordering.length - 1) { return; }
            const tempSwap = ordering[stateIndex];
            ordering[stateIndex] = ordering[stateIndex + 1]
            ordering[stateIndex + 1] = tempSwap;

            $projectStore.storage.states = $projectStore.storage.states;
        }
    }
</script>

<FormGrouping class="grow shrink space-y-2 
    w-full min-h-0"
    contentClass="scrollbar-thin scrollbar-thumb-slate-600 hover:scrollbar-thumb-rounded overflow-x-hidden
        pr-4 mr-1">
    <svelte:fragment slot="header">
        <p class="text-slate-300 text-xl align-middle">Game States</p>
        <div class="flex flex-row space-x-4">
            <div class="flex flex-row space-x-1">
                <IconButton onclick={addState}>
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                </IconButton>
                <IconButton onclick={copyState}>
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                </IconButton>
                <IconButton onclick={deleteState}>
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                </IconButton>
            </div>
            <div class="flex flex-row space-x-1">
                <IconButton onclick={moveStateUp}>
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M5 15l7-7 7 7" />
                    </svg>
                </IconButton>
                <IconButton onclick={moveStateDown}>
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                </IconButton>
            </div>
        </div>
    </svelte:fragment>
    <svelte:fragment slot="content">
        <ScrollingRadio bind:selectedID={selectedStateID}
            deselectable={true}
            scrollingRadioData={scrollingStateData} />
    </svelte:fragment>
</FormGrouping>