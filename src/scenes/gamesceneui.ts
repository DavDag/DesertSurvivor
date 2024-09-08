import {Engine, Label, ScreenElement, Vector} from "excalibur";
import {Resources} from "../assets/resources";
import {Configs} from "../configs";

export class GameSceneUI extends ScreenElement {

    private plantDead = 0;
    public getPlantDead = () => this.plantDead;
    private plantDeadLabel: Label;

    private plantGrown = 0;
    public getPlantGrown = () => this.plantGrown;
    private plantGrownLabel: Label;

    onInitialize(engine: Engine) {
        super.onInitialize(engine);

        // Plant Grown
        this.plantGrownLabel = new Label({
            pos: new Vector(8, 8),
            font: Resources.font.NormalL,
        });
        this.addChild(this.plantGrownLabel);

        // Plant Dead
        this.plantDeadLabel = new Label({
            pos: new Vector(Configs.WindowWidth - 8, 8),
            font: Resources.font.NormalR,
        });
        this.addChild(this.plantDeadLabel);

        // Update points
        this.updatePoints();
    }

    public addPlantGrown() {
        this.plantGrown++;
        this.updatePoints();
    }

    public addPlantDead() {
        this.plantDead++;
        this.updatePoints();
    }

    private updatePoints() {
        this.plantGrownLabel.text = `Plant Grown: ${this.plantGrown}`;
        this.plantDeadLabel.text = `Plant Dead: ${this.plantDead}`;
    }
}
