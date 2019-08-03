export interface CampaignKeyParam {
    campaignKey: string;
}

export interface CharacterKeyParam {
    characterKey: string;
}

type RouteTemplateInput<T> = {
    [P in keyof T]: null;
}

function createRouteTemplateInput<T>(input: RouteTemplateInput<T>): T {
    const result: Record<string, string> = {};
    Object.keys(input).map((k) => { result[k] = ':' + k; });
    return result as unknown as T;
}

export type CampaignRouteParams = CampaignKeyParam;
export function routeToCampaign({campaignKey}: CampaignRouteParams) {
    return `/campaign/${campaignKey}`;
}
export const campaignRouteTemplate = routeToCampaign(
    createRouteTemplateInput<CampaignRouteParams>({ campaignKey: null }));

export type CharacterSelectionRouteParams = CampaignKeyParam;
export function routeToCharacterSelection({campaignKey}: CharacterSelectionRouteParams) {
    return `/campaign/${campaignKey}/character-selection`;
}
export const characterSelectionRouteTemplate = routeToCharacterSelection(
    createRouteTemplateInput<CharacterSelectionRouteParams>({ campaignKey: null }));

export type CharacterSheetRouteParams = CampaignKeyParam & CharacterKeyParam;
export function routeToCharacterSheet({campaignKey, characterKey}: CharacterSheetRouteParams) {
    return `/campaign/${campaignKey}/character/${characterKey}/character`;
}
export const characterSheetRouteTemplate = routeToCharacterSheet(
    createRouteTemplateInput<CharacterSheetRouteParams>({ campaignKey: null, characterKey: null }));

export type LogRouteParams = CampaignKeyParam & CharacterKeyParam;
export function routeToLog({campaignKey, characterKey}: LogRouteParams) {
    return `/campaign/${campaignKey}/character/${characterKey}/log`;
}
export const logRouteTemplate = routeToLog(
    createRouteTemplateInput<LogRouteParams>({ campaignKey: null, characterKey: null }));

export const campaignSelectionRoute = "/campaign/selection";