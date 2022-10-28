import { hashSHA256 } from "./miscellaneous"

export const transpileFuncs = [
    // 1.7.4 to 1.8.0+
    // - Replace imageB64 with imageHash and minimapB64 with minimapHash
    // - Store image hash mappings within $projectStore.storage.images
    async function(projectData: any): Promise<Object> {
        if(projectData.storage.images === undefined) {
            projectData.storage.images = {}
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

        return projectData;
    }
]