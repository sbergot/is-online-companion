import { createContainer } from "unstated-next";

import { Campaign } from "../contracts/campaign";
import { DataServiceContainer } from "./dataService";

function createCampaign(name: string): Campaign {
    return {
        name,
        characters: new Set(),
        combats: {},
        travels: {}
    }
}

function useCampaignService() {
    const dataService = DataServiceContainer.useContainer();
    const campaignsSource = dataService.campaigns;
    const campaigns = campaignsSource.lens.state;
    return {
        createCampaign(name: string) {
            const createdCampaign = createCampaign(name);
            const newEntry = campaignsSource.saveNew(createdCampaign);
            return newEntry;
        },
        campaigns,
        addCharacter(campaignKey: string, characterKey: string) {
            const oldCampaign = campaigns[campaignKey];
            const newcharacters = new Set(oldCampaign.data.characters);
            newcharacters.add(characterKey);
            campaignsSource.save({
                ...oldCampaign,
                data: {
                    ...oldCampaign.data,
                    lastUsedCharacter: characterKey,
                    characters: newcharacters
                }
            });
    
        }
    }
}

export const CampaignServiceContainer = createContainer(useCampaignService);
