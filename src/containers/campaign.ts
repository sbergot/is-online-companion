import { useState } from "react";
import { createContainer } from "unstated-next";

import { Campaign, CampaignSelectionState } from "../contracts/campaign";
import { DataService } from "../services/dataService";

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

function createCampaign(name: string): Campaign {
    const now = new Date();
    return {
        uuid: uuidv4(),
        name,
        createdAt: now,
        lastPlayed: now,
        characters: []
    }
}

function useCampaignService() {
    const [campaigns, setCampaigns] = useState<CampaignSelectionState>(DataService.campaigns.load());
    return {
        createCampaign(name: string) {
            const newCampaigns = {...campaigns};
            const createdCampaign = createCampaign(name);
            newCampaigns[createdCampaign.uuid] = createdCampaign;
            setCampaigns(newCampaigns);
            DataService.campaigns.save(newCampaigns);
            return createdCampaign;
        },
        campaigns
    }
}

export const CampaignServiceContainer = createContainer(useCampaignService);
