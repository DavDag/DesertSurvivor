import {Actor, Color, Engine, Vector} from "excalibur";
import {Configs} from "../configs";
import {Plant} from "./plant";
import {Slime} from "./slime";
import {rnd} from "../random";

export class Spawner extends Actor {

    constructor(pos: Vector, private plants: Plant[]) {
        super({
            name: "spawner",
            pos: pos,
            width: Configs.SpawnerSpawnSize,
            height: Configs.SpawnerSpawnSize,
        });
    }

    onInitialize(engine: Engine) {
        super.onInitialize(engine);

        // Set spawner z-index
        this.z = Configs.SpawnerZIndex;

        this.graphics.onPreDraw = (ctx) => {
            if (engine.isDebug) {
                ctx.drawCircle(Vector.Zero, 2, Color.Red);
            }
        };
    }

    public startSpawning() {
        // Schedule first spawn
        this.actions
            .delay(rnd.integer(Configs.SpawnerSpawnMinDelay, Configs.SpawnerSpawnMaxDelay))
            .callMethod(this.spawnSlime.bind(this));
    }

    private spawnSlime() {
        // Spawn slime
        const plant = rnd.pickOne(this.plants);
        const slime = new Slime(plant);
        slime.pos.x = rnd.integer(0, this.width) - this.width / 2;
        slime.pos.y = rnd.integer(0, this.height) - this.height / 2;
        this.addChild(slime);

        // Schedule next spawn
        this.actions
            .delay(rnd.integer(Configs.SpawnerSpawnMinDelay, Configs.SpawnerSpawnMaxDelay))
            .callMethod(this.spawnSlime.bind(this));
    }
}
