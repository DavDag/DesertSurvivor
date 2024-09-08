import {Color, DisplayMode, Engine, Input, Keys, Loader, Scene} from "excalibur";
import {Resources} from "./assets/resources";
import {GameScene} from "./scenes/gamescene";
import {Configs} from "./configs";
import {EndScene} from "./scenes/endscene";

// Resource loader
const loader = new Loader();
Object.values(Resources.image).forEach(loader.addResource.bind(loader));
Object.values(Resources.music).forEach(loader.addResource.bind(loader));

// Game engine
const game = new Engine({
    canvasElementId: 'game',
    width: Configs.WindowWidth,
    height: Configs.WindowHeight,
    fixedUpdateFps: 60,
    backgroundColor: Configs.BackgroundColor,
    displayMode: DisplayMode.Fixed,
    pixelArt: true,
});

// Scenes
game.add("end", new EndScene());
game.add("game", new GameScene());

// Listen to global events
game.input.keyboard.on('down', (evt: Input.KeyEvent) => {
    // // Escape to pause the game
    // if (evt.key === Keys.Escape) {
    //     window["PauseGame"]();
    // }

    // P to toggle debug mode
    if (evt.key === Keys.P) {
        game.toggleDebug();
    }
});

game.input.pointers.primary.on('wheel', (evt: Input.WheelEvent) => {
    // Zoom in/out
    if (evt.deltaY > 0) {
        game.currentScene.camera.zoom = Math.max(
            Configs.CameraMinZoom,
            game.currentScene.camera.zoom * 0.9
        );
    } else {
        game.currentScene.camera.zoom = Math.min(
            Configs.CameraMaxZoom,
            game.currentScene.camera.zoom * 1.1
        );
    }
});

game.input.pointers.primary.on('move', (evt: Input.PointerEvent) => {
    if (game.isDebug) {
        game.graphicsContext.drawCircle(evt.screenPos, 5, Color.Red);
    }
});

// Start the game
game.start(loader).then(() => window["StartGame"]());

window["StartGame"] = () => {
    void game.goToScene("game");
};

window["GameCompleted"] = (grown: number, dead: number) => {
    const endScene = game.scenes["end"] as EndScene;
    endScene.setGrownPlants(grown);
    endScene.setDeadPlants(dead);
    void game.goToScene("end");
};

window["RestartGame"] = () => {
    void game.goToScene("game");
};

window["PauseGame"] = () => {
    game.stop();
};

window["ResumeGame"] = () => {
    void game.start();
};
