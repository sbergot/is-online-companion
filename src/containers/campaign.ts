import { createContainer } from "unstated-next";

import { Campaign } from "../contracts/campaign";
import { DataServiceContainer } from "./dataService";
import { Entry } from "../contracts/persistence";
import { Character } from "../contracts/character";


function createCampaign(name: string): Campaign {
    return {
        name,
        characters: new Set()
    }
}

function useCampaignService() {
    const dataService = DataServiceContainer.useContainer();
    const campaigns = dataService.campaigns.values;
    return {
        createCampaign(name: string) {
            const createdCampaign = createCampaign(name);
            const newEntry = dataService.campaigns.saveNew(createdCampaign);
            return newEntry;
        },
        campaigns,
        routeTo(campaign: Entry<Campaign>) {
            return '/campaign/' + campaign.key;
        },
        addCharacter(campaignKey: string, characterKey: string) {
            const oldCampaign = campaigns[campaignKey];
            const newcharacters = new Set(oldCampaign.data.characters);
            newcharacters.add(characterKey);
            dataService.campaigns.save({
                ...oldCampaign,
                data: {
                    ...oldCampaign.data,
                    characters: newcharacters
                }
            });
    
        }
    }
}

export const CampaignServiceContainer = createContainer(useCampaignService);
