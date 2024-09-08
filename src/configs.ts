import {Color, Vector} from "excalibur";

export const Configs = {
    Volume: 0.5,

    WindowWidth: 800,
    WindowHeight: 600,
    BackgroundColor: Color.Black,

    StartingCameraZoom: 2,
    CameraMinZoom: 0.75,
    CameraMaxZoom: 4,

    BackgroundZIndex: -300,
    IsleZIndex: -200,
    PlantZIndex: -100,
    SlimeZIndex: 0,
    PlayerZIndex: 100,
    SpawnerZIndex: 200,

    MapWidth: 150,
    MapHeight: 150,
    IsleWidth: 25,
    IsleHeight: 25,
    PlantingZoneSize: 5,
    TileWidth: 16,
    TileHeight: 16,

    PlayerAnimFrameDuration: 100,
    PlayerStepSoundDelay: 350,
    PlayerAttackAnimFrameDuration: 100,
    PlayerSpeed: 75,

    SlimeAnimFrameDuration: 150,
    SlimeAttackAnimFrameDuration: 250,
    SlimeSpeed: 25,
    SlimeAttackDelay: 1000,

    IsleDebrisChance: 0.05,

    PlantingZoneDebrisChance: 0.05,
    PlantingZoneInitialPlantCount: 10,
    PlantHealth: 3,
    PlantGrowthTryInterval: 1000,
    PlantGrowthChance: 0.01,

    SpawnerPositions: [
        new Vector(70, 70),
        new Vector(70, 330),
        new Vector(330, 70),
        new Vector(330, 330),
    ],
    SpawnerSpawnSize: 100,
    SpawnerSpawnMinDelay: 1000,
    SpawnerSpawnMaxDelay: 5000,
};
