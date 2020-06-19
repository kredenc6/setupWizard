# JsonApp Setup Wizard

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
      - click not selected json for preview (grey border)
      - click selected json (blue border) to set it as active, closes the menu
      - doubleclick (any json) for setting it as active, closes the menu
      - purple border marks active json
      - if any json has a git status (like *conflicted*, *not_added*, ...) it will be displayed under it's file name

#### Select platforms

  - select which platforms will be available in the step *Selected platforms*
  - at least one needs to be selected

For full functionality you need to run locally a [dedicated server](https://github.com/kredenc6/setupWizardLocalServer2).

