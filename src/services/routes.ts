export function routeToCampaign(campaignKey: string) {
    return `/campaign/${campaignKey}`;
}

export function routeToCampaignCharacterSelection(campaignKey: string) {
    return `/campaign/${campaignKey}/character-selection`;
}

export function routeToCampaignCharacter(campaignKey: string, characterKey: string) {
    return `/campaign/${campaignKey}/character/${characterKey}/character`;
}

export function routeToCampaignLog(campaignKey: string, characterKey: string) {
    return `/campaign/${campaignKey}/character/${characterKey}/log`;
}
