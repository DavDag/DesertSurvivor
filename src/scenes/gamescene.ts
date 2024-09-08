import {Actor, ElasticToActorStrategy, Engine, Graphic, Scene, SpriteSheet, Tile, TileMap, Vector} from "excalibur";
import {Configs} from "../configs";
import {Resources} from "../assets/resources";
import {Player} from "./player";

export class GameScene extends Scene {

    private spriteSheet: SpriteSheet;
    private bgTileMap: TileMap;
    private isleTileMap: TileMap;
    private player: Player;

    onInitialize(engine: Engine) {
        super.onInitialize(engine);

        // Create sprite sheet
        this.spriteSheet = SpriteSheet.fromImageSource({
            image: Resources.image.worldTileMap,
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
    }

    private fillMap() {
        // Fill background tile map (sea)
        for (let tile of this.bgTileMap.tiles) {
            const sprite = this.spriteSheet
                .getSprite(12, 10, {
                    rotation: Math.floor(Math.random() * 4) * Math.PI / 2
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
    }
}
