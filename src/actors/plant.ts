import {Actor, CollisionType, Color, Engine, SpriteSheet, Tile, Vector} from "excalibur";
import {Configs} from "../configs";
import {Resources} from "../assets/resources";

export class Plant extends Actor {

    private growthStage = 0;

    constructor(private tile: Tile) {
        super({
            name: "plant",
            pos: tile.pos.add(new Vector(tile.width / 2, tile.height / 2)),
            width: Configs.TileWidth,
            height: Configs.TileHeight,
            color: Color.Violet
        });
    }

    onInitialize(engine: Engine) {
        super.onInitialize(engine);

        // Set plant sprite
        const spriteSheet = SpriteSheet.fromImageSource({
            image: Resources.image.plant,
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
        this.graphics.add("seed.0", spriteSheet.getSprite(10, 3));
        this.graphics.add("seed.1", spriteSheet.getSprite(11, 3));
        this.graphics.add("seed.2", spriteSheet.getSprite(12, 3));
        this.graphics.use("seed.0");

        // Set plant z-index
        this.z = Configs.PlantZIndex;

        this.graphics.onPreDraw = (ctx) => {
            if (engine.isDebug) {
                ctx.drawCircle(Vector.Zero, 2, Color.Viridian);
            }
        };
    }

    public grow() {
        this.growthStage++;
        if (this.growthStage > 2) {
            this.growthStage = 2;
        }
        this.graphics.use(`seed.${this.growthStage}`);
    }
}
