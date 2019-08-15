import { CampaignKeyParam, CharacterKeyParam } from '../contracts/routes';

type RouteTemplateInput<T> = {
    [P in keyof T]: null;
};

interface RouteDef<T> {
    to: (params: T) => string;
    template: string;
}

function createRouteDef<T>(to: (p: T) => string, input: RouteTemplateInput<T>): RouteDef<T> {
    const result: Record<string, string> = {};
    Object.keys(input).map(k => {
        result[k] = ':' + k;
    });
    return {
        template: to((result as unknown) as T),
        to,
    };
}

export const campaignRoute: RouteDef<CampaignKeyParam> = createRouteDef(
    ({ campaignKey }) => `/campaign/${campaignKey}`,
    { campaignKey: null },
);

export const characterSelectionRoute: RouteDef<CampaignKeyParam> = createRouteDef(
    ({ campaignKey }) => `/campaign/${campaignKey}/character-selection`,
    { campaignKey: null },
);

export const characterSheetRoute: RouteDef<CampaignKeyParam & CharacterKeyParam> = createRouteDef(
    ({ campaignKey, characterKey }) => `/campaign/${campaignKey}/character/${characterKey}/character`,
    { campaignKey: null, characterKey: null },
);

export const logRoute: RouteDef<CampaignKeyParam & CharacterKeyParam> = createRouteDef(
    ({ campaignKey, characterKey }) => `/campaign/${campaignKey}/character/${characterKey}/log`,
    { campaignKey: null, characterKey: null },
);

export const tracksRoute: RouteDef<CampaignKeyParam & CharacterKeyParam> = createRouteDef(
    ({ campaignKey, characterKey }) => `/campaign/${campaignKey}/character/${characterKey}/tracks`,
    { campaignKey: null, characterKey: null },
);

export const notesRoute: RouteDef<CampaignKeyParam & CharacterKeyParam> = createRouteDef(
    ({ campaignKey, characterKey }) => `/campaign/${campaignKey}/character/${characterKey}/notes`,
    { campaignKey: null, characterKey: null },
);

export const campaignSelectionRoute = '/campaign/selection';

export const aboutRoute = '/about';
