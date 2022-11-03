import { hashSHA256 } from "./miscellaneous"

export const transpileFuncs: ((projectData: any) => Promise<Object>)[] = [
    // 1.7.3/1.7.4 to 1.8.0/1.8.1
    // - Replace imageB64 with imageHash and minimapB64 with minimapHash
    // - Store image hash mappings within $projectStore.storage.images
    async function(projectData: any): Promise<Object> {
        if(["1.7.3", "1.7.4"]
            .includes(projectData.version) === false) {
            return projectData;
        }

        // Iterate over images within each state, hashing and storing in images
        for(const _stateData of Object.values(projectData.storage.states.data)) {
            const stateData = _stateData as any;
            if(stateData.imageB64 !== undefined) { 
                const imageHash = await hashSHA256(stateData.imageB64);
                projectData.storage.images[imageHash] = stateData.imageB64;
                stateData.imageHash = imageHash;
                delete stateData.imageB64;
            }
            for(const _minimapLocationData of Object.values(stateData.locations.data)) {
                const minimapLocationData = _minimapLocationData as any;
                if(minimapLocationData.minimapB64 !== undefined) {
                    const imageHash = await hashSHA256(minimapLocationData.minimapB64);
                    projectData.storage.images[imageHash] = minimapLocationData.minimapB64;
                    minimapLocationData.minimapHash = imageHash;
                    delete minimapLocationData.minimapB64;
                }
            }
        }

        projectData.version = "1.8.1";

        return projectData;
    },
    // 1.8.0/1.8.1/1.8.2 to 1.9.0
    // - Remove starting scene designation, add pointer from opening and intermediate
    async function(projectData: any): Promise<Object> {
        if(["1.8.0", "1.8.1"]
            .includes(projectData.version) === false) {
            return projectData;
        }

        let startingStateData: any = undefined;
        let openingStateData: any = undefined;
        for(const _stateData of Object.values(projectData.storage.states.data)) {
            const stateData = _stateData as any;
            if(stateData.type === "starting") {
                startingStateData = stateData;
            } else if(stateData.type === "opening") {
                openingStateData = stateData;
            }
        }        

        if(startingStateData !== undefined) {
            startingStateData.type = "normal";
        }
        if(openingStateData !== undefined && startingStateData !== undefined) {
            openingStateData.args[0] = startingStateData.id;
        }

        projectData.version = "1.9.0";

        return projectData;
    }
]