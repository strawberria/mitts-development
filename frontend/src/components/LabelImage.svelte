<script lang="ts">
    export let label: string;
    export let imageData: string; // base64 encoded
    let customClass: string = "";
    export { customClass as class };
</script>

<div class={`grow flex flex-col items-start space-y-0.5
    ${customClass}`}>
    <p class="pl-1 
        text-slate-400 text-sm">
        {label}
    </p>
    <div class="grow flex flex-col basis-0 min-h-0">
        {#if imageData !== ""}
            <img class="object-contain h-full"
                src={imageData}
                alt={""}/>
        {/if}
    </div>
</div>