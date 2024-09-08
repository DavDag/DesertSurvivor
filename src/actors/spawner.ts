import {Actor, Color, Engine, Random, Vector} from "excalibur";
import {Configs} from "../configs";
import {Plant} from "./plant";
import {Slime} from "./slime";

export class Spawner extends Actor {

    private rand = new Random();

    constructor(pos: Vector, private plants: Plant[]) {
        super({
            name: "spawner",
            pos: pos,
            width: Configs.SpawnerSpawnSize,
            height: Configs.SpawnerSpawnSize,
            //color: Color.Violet
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
        this.actions
            .delay(this.rand.integer(Configs.SpawnerSpawnMinDelay, Configs.SpawnerSpawnMaxDelay))
            .callMethod(this.spawnSlime.bind(this));
    }

    private spawnSlime() {
        const plant = this.rand.pickOne(this.plants);
        const slime = new Slime(plant);
        slime.pos.x = this.rand.integer(0, this.width);
        slime.pos.y = this.rand.integer(0, this.height);
        this.addChild(slime);

        this.actions
            .delay(this.rand.integer(Configs.SpawnerSpawnMinDelay, Configs.SpawnerSpawnMaxDelay))
            .callMethod(this.spawnSlime.bind(this));
    }
}
