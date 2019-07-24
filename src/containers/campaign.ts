import { useState } from "react";
import { createContainer } from "unstated-next";

import { Campaign } from "../contracts/campaign";
import { useDataService } from "../services/hooks";
import { KeyMap, Entry } from "../contracts/persistence";


function createCampaign(name: string): Campaign {
    return {
        name,
        characters: []
    }
}

function useCampaignService() {
    const dataService = useDataService();
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
