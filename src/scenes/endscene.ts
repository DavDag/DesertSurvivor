import {Color, Engine, Label, Scene, SceneActivationContext, Vector} from "excalibur";
import {Configs} from "../configs";
import {Resources} from "../assets/resources";

export class EndScene extends Scene {

    private deadPlants = 0;
    private grownPlants = 0;

    private score: Label;
    private playAgain: Label;

    onInitialize(engine: Engine) {
        super.onInitialize(engine);

        // Score
        this.score = new Label({
            pos: new Vector(Configs.WindowWidth / 2, 8),
            text: "Game Ended",
            font: Resources.font.NormalC,
            color: Color.White
        });
        this.add(this.score);

        // Play Again
        this.playAgain = new Label({
            pos: new Vector(Configs.WindowWidth / 2, Configs.WindowHeight / 2),
            text: "Click to play again",
            font: Resources.font.NormalC,
            color: Color.White
        });
        this.playAgain.on("pointerup", () => {
            window["RestartGame"]();
        });
        this.playAgain.on("pointerenter", () => {
            this.playAgain.color = Color.Yellow;
        });
        this.playAgain.on("pointerleave", () => {
            this.playAgain.color = Color.White;
        });
        this.add(this.playAgain);
    }

    onActivate(context: SceneActivationContext<unknown>) {
        super.onActivate(context);
        this.score.text = `Plants Grown: ${this.grownPlants} & Plants Dead: ${this.deadPlants}`;
    }

    public setGrownPlants(grownPlants: number) {
        this.grownPlants = grownPlants;
    }

    public setDeadPlants(deadPlants: number) {
        this.deadPlants = deadPlants;
    }
}
