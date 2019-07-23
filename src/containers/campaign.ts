import { useState } from "react";
import { createContainer } from "unstated-next";

import { Campaign, CampaignSelectionState } from "../contracts/campaign";
import { DataService } from "../services/dataService";

function createCampaign(name: string): Campaign {
    const now = new Date();
    return {
        name,
        createdAt: now,
        lastPlayed: now,
        characters: []
    }
}

function useCampaignService() {
    const [campaigns, setCampaigns] = useState<CampaignSelectionState>({
        campaigns: DataService.campaigns.load()
    });
    return {
        createCampaign(name: string) {
            const newCampaigns = [...campaigns.campaigns];
            newCampaigns.push(createCampaign(name));
            setCampaigns({ campaigns: newCampaigns })
            DataService.campaigns.save(newCampaigns);
        }
    }
}

export const { Provider, useContainer } = createContainer(useCampaignService);
