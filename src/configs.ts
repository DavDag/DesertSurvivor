import {Color} from "excalibur";

export const Configs = {
    WindowWidth: 800,
    WindowHeight: 600,
    //BackgroundColor: Color.fromHex("#D5A05D"),
    BackgroundColor: Color.Black,

    StartingCameraZoom: 2,
    CameraMinZoom: 0.75,
    CameraMaxZoom: 4,

    BackgroundZIndex: -3,
    IsleZIndex: -2,
    PlantZIndex: -1,
    SlimeZIndex: 0,
    PlayerZIndex: 1,

    MapWidth: 150,
    MapHeight: 150,
    IsleWidth: 25,
    IsleHeight: 25,
    PlantingZoneSize: 5,
    TileWidth: 16,
    TileHeight: 16,

    PlayerAnimFrameDuration: 100,
    PlayerAttackAnimFrameDuration: 100,
    PlayerSpeed: 75,

    SlimeAnimFrameDuration: 150,
    SlimeAttackAnimFrameDuration: 250,
    SlimeSpeed: 25,
    SlimeAttackDelay: 2000,

    PlantingZoneDebrisChance: 0.3,
    PlantingZoneInitialPlantCount: 5,
};
