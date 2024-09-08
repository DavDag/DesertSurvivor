import {Actor, Color, Engine, GraphicsGroup, Sprite, SpriteSheet, Tile, Timer, Vector} from "excalibur";
import {Configs} from "../configs";
import {Resources} from "../assets/resources";
import {rnd} from "../random";

export class Plant extends Actor {

    private health = Configs.PlantHealth;
    private growthStage = 0;
    private growthTimer: Timer;

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

        // Set Plant sprite
        const spriteSheet = SpriteSheet.fromImageSource({
            image: Resources.image.Plant,
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
        const sprite0 = spriteSheet.getSprite(10, 3);
        const sprite1 = spriteSheet.getSprite(11, 3);
        const sprite2 = new GraphicsGroup({
            members: [
                {
                    graphic: spriteSheet.getSprite(12, 3),
                    offset: Vector.Zero,
                },
                {
                    graphic: spriteSheet.getSprite(12, 2),
                    offset: new Vector(0, -16),
                }
            ],
            useAnchor: true,
        });
        this.graphics.add("seed.0", sprite0);
        this.graphics.add("seed.1", sprite1);
        this.graphics.add("seed.2", sprite2);
        this.graphics.use("seed.0");

        // Set growth timer
        this.growthTimer = new Timer({
            interval: Configs.PlantGrowthTryInterval,
            fcn: () => {
                if (rnd.next() < Configs.PlantGrowthChance) this.grow();
            },
            repeats: true,
        });
        this.scene.add(this.growthTimer);
        this.growthTimer.start();

        // Set Plant z-index
        this.z = Configs.PlantZIndex + this.tile.x + this.tile.y * Configs.PlantingZoneSize;

        this.graphics.onPreDraw = (ctx) => {
            if (engine.isDebug) {
                ctx.drawCircle(Vector.Zero, 2, Color.Viridian);
            }
        };
    }

    public takeDamage() {
        // Reduce health
        this.health--;

        // If health is zero, kill plant
        if (this.health <= 0) {
            // Remove from scene
            this.kill();

            // Play plant dies sound
            void Resources.music.PickUp.play(Configs.Volume);

            // Communicate it to GameScene
            this.scene.emit("plant-dies", this);
        }

        // Change plant color
        const color = Color.Red;
        color.a = (this.health / Configs.PlantHealth);
        this.graphics.current.tint = color;
    }

    private grow() {
        this.growthStage++;
        if (this.growthStage > 2) {
            // Remove from scene
            this.kill();

            // Play plant dies sound
            void Resources.music.PickUp.play(Configs.Volume);

            // Communicate it to GameScene
            this.scene.emit("plant-grown", this);

            // Stop growth
            this.growthTimer.stop();
        } else {
            this.graphics.use(`seed.${this.growthStage}`);

            // Change plant color
            if (this.health < Configs.PlantHealth) {
                const color = Color.Red;
                color.a = (this.health / Configs.PlantHealth);
                this.graphics.current.tint = color;
            }
        }
    }
}
