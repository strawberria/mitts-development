import type { SvelteComponentDev } from "svelte/internal";
import { writable, Writable } from "svelte/store";

let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
export function randomID(length: number): string {
    let result = "";
    for(let index = 0; index < length; index++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    return result;
}

export async function sleep(duration: number) {
    return new Promise(r => setTimeout(r, duration));
}

export async function hashSHA256(data: string): Promise<string> {
    const encoder = new TextEncoder();
    const encodedData = encoder.encode(data);
    const hashBuffer = await crypto.subtle.digest("SHA-256", encodedData);
    const hash = Array.from(new Uint8Array(hashBuffer))
        .map(buffer => buffer.toString(16).padStart(2, '0'))
        .join("");
    return hash
}

export const version = "1.9.0";
export const idLength = 8;
export const playStore: Writable<boolean> = writable(false);
export const stateStore: Writable<string | undefined> = writable<string>(undefined);
export const projectStore: Writable<ProjectData> = writable<ProjectData>({
    version: version,
    data: {
        information: {
            title: "",
            version: "",
            author: "",
            synopsis: "",
        },
        actions: {
            data: {},
            ordering: [],
        },
        restraintLocations: {
            data: {},
            ordering: [],
        }
    },
    storage: {
        states: {
            data: {},
            ordering: [],
        },
        restraints: {
            data: {},
            ordering: [],
        },
        objects: {
            data: {},
            ordering: [],
        },
        images: {},
    }
});

export type NavigationData = { [key: string]: { display: string; component: typeof SvelteComponentDev } };
export type MouseClickEvent<T> = MouseEvent & { currentTarget: EventTarget & T; }
export type ChoiceData<T> = { key: T; display: string; enabled: boolean; };

export interface ScrollingRadioData {
    key:       string;
    component: typeof SvelteComponentDev, 
    props:     any;
};

export interface OrderedProjectData<T> {
    data:     { [id: string]: T };
    ordering: string[];
};
export interface ProjectConstruct {
    id: string;
}

export type StateType = "normal" | "opening" | "starting" | "intermediate" | "ending";
export type HintData = { attempts: number; text: string };
export interface ProjectStateData extends ProjectConstruct {
    title:          string;
    description:    string;
    notes:          string; // only visible in editor
    imageHash:      string; // base64-encoded
    type:           StateType;
    args:           any[];
    interactions:   OrderedProjectData<ProjectInteractionData>;
    hints:          [HintData, HintData, HintData, HintData, HintData];
    locations:      OrderedProjectData<ProjectMinimapLocationData>
}
export interface ProjectActionData extends ProjectConstruct {
    name:  string;
    verb:  string;
    order: boolean;
    two:   boolean;
}
export interface ProjectRestraintLocationData extends ProjectConstruct {
    name:    string;
    devName: string;
    initial: string;
}
export interface ProjectRestraintData extends ProjectConstruct {
    name:     string;
    devName:  string;
    location: string;
    examine:  string;
}
export interface ProjectObjectData extends ProjectConstruct {
    name:    string;
    devName: string;
    examine: string;
    initial: boolean;
}
export interface ProjectInteractionData extends ProjectConstruct {
    devName:    string;
    action:     string;
    components: [string, string];
    criteria:   OrderedProjectData<ProjectInteractionCriteriaData>;
    results:    OrderedProjectData<ProjectInteractionResultData>;
}

export interface ProjectMinimapLocationData extends ProjectConstruct {
    name:           string;
    devName:        string;
    initial:        boolean;
    minimapHash:    string; // base64-encoded
    minimapObjects: OrderedProjectData<ProjectMinimapObjectData>;
}
export type MinimapObjectType = "circle" | "vector";
export interface ProjectMinimapObjectData extends ProjectConstruct {
    devName: string;
    type:    MinimapObjectType;
    args:    [number, number][];  
    dialog:  string; // Dialog text when clicked
    object:  string; // Referenced object
}
export type InteractionCriteriaType = "flagEquals" | "flagNotEquals" | "restraintWearing" | "restraintNotWearing" | "objectFound" | "objectNotFound" | "exceededAttempts";
export interface ProjectInteractionCriteriaData extends ProjectConstruct {
    devName: string;
    type:    InteractionCriteriaType;
    args:    any[];
}
export type InteractionResultType = "restraintAdd" | "restraintRemove" | "objectReveal" | "objectHide" | "setState" | "setFlag" | "popupDialog" | "resetAttempts" | "locationAdd" | "locationRemove";
export interface ProjectInteractionResultData extends ProjectConstruct {
    devName: string;
    type:    InteractionResultType;
    args:    any[];
}

export interface ProjectData {
    version: string;
    data: {
        information: {
            title:          string;
            author:         string;
            synopsis:       string;
            version:        string;
        };
        actions: OrderedProjectData<ProjectActionData>;
        restraintLocations: OrderedProjectData<ProjectRestraintLocationData>;
    }
    storage: {
        states:       OrderedProjectData<ProjectStateData>;
        restraints:   OrderedProjectData<ProjectRestraintData>;
        objects:      OrderedProjectData<ProjectObjectData>;
        images:       { [hash: string]: string };
    }
}