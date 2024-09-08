import {
    Actor,
    ElasticToActorStrategy,
    Engine,
    range,
    Scene,
    SpriteSheet, Tile,
    TileMap,
    Vector
} from "excalibur";
import {Configs} from "../configs";
import {Resources} from "../assets/resources";
import {Player} from "../actors/player";
import {GameSceneUI} from "./gamesceneui";
import {Plant} from "../actors/plant";
import {Slime} from "../actors/slime";
import {Spawner} from "../actors/spawner";
import {rnd} from "../random";

export class GameScene extends Scene {

    private gameSceneUI: GameSceneUI;
    private spriteSheet: SpriteSheet;
    private bgTileMap: TileMap;
    private isleTileMap: TileMap;
    private player: Player;
    private plants: Plant[];
    private availablePlantingZone: Tile[];
    private spawners: Spawner[];

    onInitialize(engine: Engine) {
        super.onInitialize(engine);

        // Create UI
        this.gameSceneUI = new GameSceneUI();
        this.add(this.gameSceneUI);

        // Create sprite sheet
        this.spriteSheet = SpriteSheet.fromImageSource({
            image: Resources.image.world,
            grid: {
                rows: 15,
                columns: 14,
                spriteWidth: 16,
                spriteHeight: 16,
            },
            spacing: {
                margin: Vector.Zero,
                originOffset: Vector.Zero,
            },
        });

        // Create background tile map
        this.bgTileMap = new TileMap({
            name: "bgTileMap",
            columns: Configs.MapWidth,
            rows: Configs.MapHeight,
            tileWidth: Configs.TileWidth,
            tileHeight: Configs.TileHeight
        });
        this.bgTileMap.z = Configs.BackgroundZIndex;
        const actorForMovingBgTileMap = new Actor({
            pos: new Vector(
                -this.bgTileMap.columns * this.bgTileMap.tileWidth / 2,
                -this.bgTileMap.rows * this.bgTileMap.tileHeight / 2
            ),
        });
        actorForMovingBgTileMap.addChild(this.bgTileMap);

        // Create isle tile map
        this.isleTileMap = new TileMap({
            name: "isleTileMap",
            columns: Configs.IsleWidth,
            rows: Configs.IsleHeight,
            tileWidth: Configs.TileWidth,
            tileHeight: Configs.TileHeight
        });
        this.isleTileMap.z = Configs.IsleZIndex;

        // Add tile maps to the scene
        // this.add(this.bgTileMap);
        this.add(actorForMovingBgTileMap);
        this.add(this.isleTileMap);

        // Create player
        this.player = new Player();
        this.player.pos = new Vector(
            this.isleTileMap.columns / 2 * this.isleTileMap.tileWidth,
            this.isleTileMap.rows / 2 * this.isleTileMap.tileHeight
        );
        this.add(this.player);

        // Camera
        this.camera.pos = Vector.Zero;
        this.camera.zoom = Configs.StartingCameraZoom;
        this.camera.clearAllStrategies();
        this.camera.addStrategy(new ElasticToActorStrategy(this.player, 0.1, 0.1));

        // Fill tile maps
        this.fillMap();
        this.fillPlantingZone();

        // Create spawners
        this.spawners = Configs.SpawnerPositions.map((pos) => new Spawner(pos, this.plants));
        this.spawners.forEach(this.add.bind(this));
        this.spawners.forEach((spawner) => spawner.startSpawning());
    }

    private fillMap() {
        // Fill background tile map (sea)
        for (let tile of this.bgTileMap.tiles) {
            const sprite = this.spriteSheet
                .getSprite(12, 10, {
                    rotation: rnd.pickOne(range(0, 4)) * Math.PI / 2
                });
            tile.addGraphic(sprite);
        }
        for (let x = 0; x < Configs.IsleWidth; x++) {
            // Set top tiles (sea <-> isle)
            const topSprite = this.spriteSheet.getSprite(12, 11);
            const topTile = this.bgTileMap.getTile(
                this.bgTileMap.columns / 2 + x,
                this.bgTileMap.rows / 2 - 1
            );
            topTile.clearGraphics();
            topTile.addGraphic(topSprite);
            topTile.solid = true;

            // Set bottom tiles (isle <-> sea)
            const botSprite = this.spriteSheet.getSprite(12, 9);
            const botTile = this.bgTileMap.getTile(
                this.bgTileMap.columns / 2 + x,
                this.bgTileMap.rows / 2 + Configs.IsleHeight
            );
            botTile.clearGraphics();
            botTile.addGraphic(botSprite);
            botTile.solid = true;
        }
        for (let y = 0; y < Configs.IsleHeight; y++) {
            // Set left tiles (sea <-> isle)
            const leftSprite = this.spriteSheet.getSprite(13, 10);
            const leftTile = this.bgTileMap.getTile(
                this.bgTileMap.columns / 2 - 1,
                this.bgTileMap.rows / 2 + y
            );
            leftTile.clearGraphics();
            leftTile.addGraphic(leftSprite);
            leftTile.solid = true;

            // Set right tiles (isle <-> sea)
            const rightSprite = this.spriteSheet.getSprite(11, 10);
            const rightTile = this.bgTileMap.getTile(
                this.bgTileMap.columns / 2 + Configs.IsleWidth,
                this.bgTileMap.rows / 2 + y
            );
            rightTile.clearGraphics();
            rightTile.addGraphic(rightSprite);
            rightTile.solid = true;
        }
        {
            // Set corner tiles (bottom-left)
            const cornerSpriteBL = this.spriteSheet.getSprite(13, 12);
            const cornerTileBL = this.bgTileMap.getTile(
                this.bgTileMap.columns / 2 - 1,
                this.bgTileMap.rows / 2 + Configs.IsleHeight
            );
            cornerTileBL.clearGraphics();
            cornerTileBL.addGraphic(cornerSpriteBL);

            // Set corner tiles (bottom-right)
            const cornerSpriteBR = this.spriteSheet.getSprite(11, 12);
            const cornerTileBR = this.bgTileMap.getTile(
                this.bgTileMap.columns / 2 + Configs.IsleWidth,
                this.bgTileMap.rows / 2 + Configs.IsleHeight
            );
            cornerTileBR.clearGraphics();
            cornerTileBR.addGraphic(cornerSpriteBR);
        }

        // Fill isle tile map (isle)
        for (let tile of this.isleTileMap.tiles) {
            const sprite = this.spriteSheet.getSprite(9, 6);
            tile.addGraphic(sprite);
        }

        // Fill planting zone (border)
        for (let x = 0; x < Configs.PlantingZoneSize; x++) {
            // Set top tiles (isle <-> planting zone)
            const topSprite = this.spriteSheet.getSprite(1, 0);
            const topTile = this.isleTileMap.getTile(
                this.isleTileMap.columns / 2 + x - Configs.PlantingZoneSize / 2,
                this.isleTileMap.rows / 2 - Configs.PlantingZoneSize / 2 - 1
            );
            topTile.clearGraphics();
            topTile.addGraphic(topSprite);

            // Set bottom tiles (planting zone <-> isle)
            const botSprite = this.spriteSheet.getSprite(1, 2);
            const botTile = this.isleTileMap.getTile(
                this.isleTileMap.columns / 2 + x - Configs.PlantingZoneSize / 2,
                this.isleTileMap.rows / 2 + Configs.PlantingZoneSize / 2
            );
            botTile.clearGraphics();
            botTile.addGraphic(botSprite);
        }
        for (let y = 0; y < Configs.PlantingZoneSize; y++) {
            // Set left tiles (isle <-> planting zone)
            const leftSprite = this.spriteSheet.getSprite(0, 1);
            const leftTile = this.isleTileMap.getTile(
                this.isleTileMap.columns / 2 - Configs.PlantingZoneSize / 2 - 1,
                this.isleTileMap.rows / 2 + y - Configs.PlantingZoneSize / 2
            );
            leftTile.clearGraphics();
            leftTile.addGraphic(leftSprite);

            // Set right tiles (planting zone <-> isle)
            const rightSprite = this.spriteSheet.getSprite(2, 1);
            const rightTile = this.isleTileMap.getTile(
                this.isleTileMap.columns / 2 + Configs.PlantingZoneSize / 2,
                this.isleTileMap.rows / 2 + y - Configs.PlantingZoneSize / 2
            );
            rightTile.clearGraphics();
            rightTile.addGraphic(rightSprite);
        }
        {
            // Set corner tiles (top-left)
            const cornerSpriteTL = this.spriteSheet.getSprite(0, 0);
            const cornerTileTL = this.isleTileMap.getTile(
                this.isleTileMap.columns / 2 - Configs.PlantingZoneSize / 2 - 1,
                this.isleTileMap.rows / 2 - Configs.PlantingZoneSize / 2 - 1
            );
            cornerTileTL.clearGraphics();
            cornerTileTL.addGraphic(cornerSpriteTL);

            // Set corner tiles (top-right)
            const cornerSpriteTR = this.spriteSheet.getSprite(2, 0);
            const cornerTileTR = this.isleTileMap.getTile(
                this.isleTileMap.columns / 2 + Configs.PlantingZoneSize / 2,
                this.isleTileMap.rows / 2 - Configs.PlantingZoneSize / 2 - 1
            );
            cornerTileTR.clearGraphics();
            cornerTileTR.addGraphic(cornerSpriteTR);

            // Set corner tiles (bottom-left)
            const cornerSpriteBL = this.spriteSheet.getSprite(0, 2);
            const cornerTileBL = this.isleTileMap.getTile(
                this.isleTileMap.columns / 2 - Configs.PlantingZoneSize / 2 - 1,
                this.isleTileMap.rows / 2 + Configs.PlantingZoneSize / 2
            );
            cornerTileBL.clearGraphics();
            cornerTileBL.addGraphic(cornerSpriteBL);

            // Set corner tiles (bottom-right)
            const cornerSpriteBR = this.spriteSheet.getSprite(2, 2);
            const cornerTileBR = this.isleTileMap.getTile(
                this.isleTileMap.columns / 2 + Configs.PlantingZoneSize / 2,
                this.isleTileMap.rows / 2 + Configs.PlantingZoneSize / 2
            );
            cornerTileBR.clearGraphics();
            cornerTileBR.addGraphic(cornerSpriteBR);
        }
    }

    private fillPlantingZone() {
        // Fill planting zone (with debris)
        this.availablePlantingZone = [];
        for (let x = 0; x < Configs.PlantingZoneSize; x++) {
            for (let y = 0; y < Configs.PlantingZoneSize; y++) {
                const tile = this.isleTileMap.getTile(
                    this.isleTileMap.columns / 2 + x - Configs.PlantingZoneSize / 2,
                    this.isleTileMap.rows / 2 + y - Configs.PlantingZoneSize / 2
                );

                // Random debris
                if (rnd.next() < Configs.PlantingZoneDebrisChance) {
                    tile.clearGraphics();
                    const sprite = this.spriteSheet.getSprite(rnd.pickOne(range(3, 10)), 4);
                    tile.addGraphic(sprite);
                }

                // Add to available planting zone
                this.availablePlantingZone.push(tile);
            }
        }
        this.availablePlantingZone = rnd.shuffle(this.availablePlantingZone);

        // Add starting plant
        this.plants = new Array(Configs.PlantingZoneInitialPlantCount)
            .fill(0)
            .map(() => {
                const tile = this.availablePlantingZone.pop();
                tile.clearGraphics();
                tile.addGraphic(this.spriteSheet.getSprite(10, 3));
                return new Plant(tile);
            });
        this.plants.forEach(this.add.bind(this));
    }
}
