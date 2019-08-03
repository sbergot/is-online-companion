type RouteTemplateInput<T> = {
    [P in keyof T]: null;
}

interface RouteDef<T> {
    to: (params: T) => string;
    template: string;
}

function createRouteTemplateInput<T>(to: (p: T) => string, input: RouteTemplateInput<T>): RouteDef<T> {
    const result: Record<string, string> = {};
    Object.keys(input).map((k) => { result[k] = ':' + k; });
    return {
        template: to(result as unknown as T),
        to
    }
}

export interface CampaignKeyParam {
    campaignKey: string;
}

export interface CharacterKeyParam {
    characterKey: string;
}

export const campaignRoute: RouteDef<CampaignKeyParam> = createRouteTemplateInput(
    ({campaignKey}) => `/campaign/${campaignKey}`,
    { campaignKey: null }
);

export const characterSelectionRoute: RouteDef<CampaignKeyParam> = createRouteTemplateInput(
    ({campaignKey}) => `/campaign/${campaignKey}/character-selection`,
    { campaignKey: null }
);

export const characterSheetRoute: RouteDef<CampaignKeyParam & CharacterKeyParam> = createRouteTemplateInput(
    ({campaignKey, characterKey}) => `/campaign/${campaignKey}/character/${characterKey}/character`,
    { campaignKey: null, characterKey: null }
);

export const logRoute: RouteDef<CampaignKeyParam & CharacterKeyParam> = createRouteTemplateInput(
    ({campaignKey, characterKey}) => `/campaign/${campaignKey}/character/${characterKey}/log`,
    { campaignKey: null, characterKey: null }
);

export const tracksRoute: RouteDef<CampaignKeyParam & CharacterKeyParam> = createRouteTemplateInput(
    ({campaignKey, characterKey}) => `/campaign/${campaignKey}/character/${characterKey}/tracks`,
    { campaignKey: null, characterKey: null }
);

export const campaignSelectionRoute = "/campaign/selection";