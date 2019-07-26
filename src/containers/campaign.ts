import { createContainer } from "unstated-next";

import { Campaign } from "../contracts/campaign";
import { DataServiceContainer } from "./dataService";
import { Entry } from "../contracts/persistence";


function createCampaign(name: string): Campaign {
    return {
        name,
        characters: new Set()
    }
}

function useCampaignService() {
    const dataService = DataServiceContainer.useContainer();
    return {
        createCampaign(name: string) {
            const createdCampaign = createCampaign(name);
            const newEntry = dataService.campaigns.saveNew(createdCampaign);
            return newEntry;
        },
        campaigns: dataService.campaigns.values,
        routeTo(campaign: Entry<Campaign>) {
            return '/campaign/' + campaign.key;
        }
    }
}

export const CampaignServiceContainer = createContainer(useCampaignService);
