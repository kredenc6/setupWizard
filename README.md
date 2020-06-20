# JsonApp Setup Wizard

For full functionality you need to run locally a [dedicated server](https://github.com/kredenc6/setupWizardLocalServer2).

## Manual

### Main Menu

#### App Topic

  - In it's basic functionality it fills in `app_topic` json value and determines json file name. Changing file names manually **is not recomended** as it can cause compatibility issues!
  - with change
      - **clear other values** option creates a new json with filled in `app_topic`
      - **set also as channel values** option fills in topic into channels/queries of selected platforms
          - this also works with platform selection
  - topic need to be at least 2 characters long

#### Handle json files

  - `git state` button opens a list displaying the git status and available git actions (requires dedicated server connection)
      - it gets updated with every git action, on the first render however it doesn't refresh if the last update was less than a minute ago
      - you can always use the `refresh` button to get the latest git status
  - `show jsons` button opens the `Available jsons` menu
      - you need to use `load json(s) from repo` button to make them available
          - if it's still disabled there are no available jsons in the repo folder
  - `load json(s) manually` button allows you to load json(s) from your local machine
  - `load json(s) from repo` button asks server to send available jsons from predetermined folder and loads them
  - Loaded jsons need to have predetermined format otherwise the setup will not work correctly, if at all! There is no json file check implemented at the moment.
  - `Available jsons` menu
      - search has no implemented functionality at the moment
      - click not selected (grey border) json for preview
      - click selected json (blue border) to set it as active, closes the menu
      - doubleclick (any json) for setting it as active, closes the menu
      - purple border marks the active json
      - if any json has a git status (like *conflicted*, *not_added*, ...) it will be displayed under it's file name

#### Select platforms

  - select which platforms will be available in the step *Selected platforms*
  - at least one platform needs to be selected

### Color scheme

  - in `user interfaces` you can choose there one of the preset color schemes and see the changes apply
  - `color palette` let's you choose and apply color to the selected `current scheme`
  - in `current scheme` you can select to which scheme or text you want to apply your color change

### Selected platforms

  - some of the text fields has an online verification
      - from 3 characters up it checks if the address exists (looks for htttp code 200) and shows *verified* or *invalid* as a result
      - requires server connection

### Config.json

  - on the left side you have the rest of json properties that are not part of the platmorms themselves
  - the middle part contains file handling buttons and options
      - `git state` button is described in [Handle json files](https://github.com/kredenc6/setupWizard#handle-json-files) section of this manual
  - `clear values from unused platforms before saving` button has no implemented functionality at the moment and is always disabled
  - with `download as _.json` button you can save the json file locally
  - `save to repo as _.json` button sends the json to the server which saves it to the predetermined repo folder
      - after the save with `commit` checkbox ticked a commit poper will appear for you to set the commit message
      - the `push` checkbox will make the server to push the changes to the predetermined remote repo
      - click on the button refreshes the git state after running the desired action(s)
      - requiers server connection
  - the right side contains created json preview

##### Initial json format:

```
{
  "title": "",
  "app_topic": "",
  "apk_suffix": "",
  "show_add_free_privacy_policy": false,
  "feedback_email_address": "johndoe@knowhere.com",
  "youtube_api_key": "",
  "youtube_fallback_api_key": "",
  
  "ad_settings": {
    "ad_mob_app_id": "",
    "ad_mob_ad_unit_id": ""
  },
  "ui_colors": {
    "name": "default",
    "primaryColor": "#52a9ba",
    "primaryLightColor": "#86dbec",
    "primaryDarkColor": "#127a8a",
    "primaryTextColor": "#000000",
    "secondaryColor": "#bcaaa4",
    "secondaryTextColor": "#fafafa",
    "accent": "#FF4081",
    "fab": "#ba8d4d"
  },
  "visible_components": [],
  "facebook": {
    "channel": ""
  },
  "instagram": {
    "main_channel": "",
    "other_channels": []
  },
  "reddit": {
    "sub_reddit": "",
    "search_query": ""
  },
  "websites": [],
  "videos": [
    {
      "source": "youtube",
      "show_in_app": false,
      "queries": [],
      "blocked_videos": []
    },
    {
      "source": "vimeo",
      "show_in_app": false,
      "queries": [],
      "blocked_videos": []
    }
  ],
  "audio": [
    {
      "source": "soundcloud",
      "show_in_app": false,
      "queries": [],
      "blocked_tracks": []
    }
  ],
  "books": [
    {
      "source": "bol",
      "show_in_app": false,
      "queries": [],
      "blocked_book_ids": []
    }
  ],
  "twitter": [
    {
      "channel_name": "",
      "url": "",
      "main_feed": false,
      "show_in_app": false
    }
  ],
  "events": {}
};
```