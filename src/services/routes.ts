
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

export type CampaignCharacterSelectionRouteParams = CampaignKeyParam;
export function routeToCampaignCharacterSelection({campaignKey}: CampaignCharacterSelectionRouteParams) {
    return `/campaign/${campaignKey}/character-selection`;
}
export const campaignCharacterSelectionRouteTemplate = routeToCampaignCharacterSelection(
    createRouteTemplateInput<CampaignCharacterSelectionRouteParams>({ campaignKey: null }));

export type CampaignCharacterRouteParams = CampaignKeyParam & CharacterKeyParam;
export function routeToCampaignCharacter({campaignKey, characterKey}: CampaignCharacterRouteParams) {
    return `/campaign/${campaignKey}/character/${characterKey}/character`;
}
export const campaignCharacterRouteTemplate = routeToCampaignCharacter(
    createRouteTemplateInput<CampaignCharacterRouteParams>({ campaignKey: null, characterKey: null }));

export type CampaignLogRouteParams = CampaignKeyParam & CharacterKeyParam;
export function routeToCampaignLog({campaignKey, characterKey}: CampaignLogRouteParams) {
    return `/campaign/${campaignKey}/character/${characterKey}/log`;
}
export const campaignLogRouteTemplate = routeToCampaignLog(
    createRouteTemplateInput<CampaignLogRouteParams>({ campaignKey: null, characterKey: null }));

export const campaignSelectionRoute = "/campaign/selection";