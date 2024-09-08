import {
    Actor,
    Animation,
    AnimationStrategy,
    CollisionType,
    Color,
    Engine,
    Keys,
    range,
    SpriteSheet,
    Vector
} from "excalibur";
import {Configs} from "../configs";
import {Resources} from "../assets/resources";

export class Player extends Actor {

    constructor() {
        super({
            name: "player",
            pos: Vector.Zero,
            width: Configs.TileWidth,
            height: Configs.TileHeight,
            color: Color.Viridian,
            collisionType: CollisionType.Active
        });
    }

    onInitialize(engine: Engine) {
        super.onInitialize(engine);

        // Set player sprite
        const spriteSheet = SpriteSheet.fromImageSource({
            image: Resources.image.player,
            grid: {
                rows: 10,
                columns: 6,
                spriteWidth: 48,
                spriteHeight: 48,
            },
            spacing: {
                margin: Vector.Zero,
                originOffset: Vector.Zero,
            },
        });

        // Create animations
        const idleAnimDown = Animation.fromSpriteSheet(
            spriteSheet,
            range(0, 5),
            Configs.PlayerAnimFrameDuration,
            AnimationStrategy.Loop
        );
        const idleAnimRight = Animation.fromSpriteSheet(
            spriteSheet,
            range(6, 11),
            Configs.PlayerAnimFrameDuration,
            AnimationStrategy.Loop
        );
        const idleAnimUp = Animation.fromSpriteSheet(
            spriteSheet,
            range(12, 17),
            Configs.PlayerAnimFrameDuration,
            AnimationStrategy.Loop
        );
        const idleAnimLeft = Animation.fromSpriteSheetCoordinates({
            spriteSheet,
            frameCoordinates: [
                {x: 0, y: 1, duration: Configs.PlayerAnimFrameDuration, options: {flipHorizontal: true}},
                {x: 1, y: 1, duration: Configs.PlayerAnimFrameDuration, options: {flipHorizontal: true}},
                {x: 2, y: 1, duration: Configs.PlayerAnimFrameDuration, options: {flipHorizontal: true}},
                {x: 3, y: 1, duration: Configs.PlayerAnimFrameDuration, options: {flipHorizontal: true}},
                {x: 4, y: 1, duration: Configs.PlayerAnimFrameDuration, options: {flipHorizontal: true}},
                {x: 5, y: 1, duration: Configs.PlayerAnimFrameDuration, options: {flipHorizontal: true}},
            ],
            strategy: AnimationStrategy.Loop
        });
        const runAnimDown = Animation.fromSpriteSheet(
            spriteSheet,
            range(18, 23),
            Configs.PlayerAnimFrameDuration,
            AnimationStrategy.Loop
        );
        const runAnimRight = Animation.fromSpriteSheet(
            spriteSheet,
            range(24, 29),
            Configs.PlayerAnimFrameDuration,
            AnimationStrategy.Loop
        );
        const runAnimUp = Animation.fromSpriteSheet(
            spriteSheet,
            range(30, 35),
            Configs.PlayerAnimFrameDuration,
            AnimationStrategy.Loop
        );
        const runAnimLeft = Animation.fromSpriteSheetCoordinates({
            spriteSheet,
            frameCoordinates: [
                {x: 0, y: 4, duration: Configs.PlayerAnimFrameDuration, options: {flipHorizontal: true}},
                {x: 1, y: 4, duration: Configs.PlayerAnimFrameDuration, options: {flipHorizontal: true}},
                {x: 2, y: 4, duration: Configs.PlayerAnimFrameDuration, options: {flipHorizontal: true}},
                {x: 3, y: 4, duration: Configs.PlayerAnimFrameDuration, options: {flipHorizontal: true}},
                {x: 4, y: 4, duration: Configs.PlayerAnimFrameDuration, options: {flipHorizontal: true}},
                {x: 5, y: 4, duration: Configs.PlayerAnimFrameDuration, options: {flipHorizontal: true}},
            ],
            strategy: AnimationStrategy.Loop
        });
        this.graphics.add("idle.down", idleAnimDown);
        this.graphics.add("idle.right", idleAnimRight);
        this.graphics.add("idle.up", idleAnimUp);
        this.graphics.add("idle.left", idleAnimLeft);
        this.graphics.add("run.down", runAnimDown);
        this.graphics.add("run.right", runAnimRight);
        this.graphics.add("run.up", runAnimUp);
        this.graphics.add("run.left", runAnimLeft);
        this.graphics.use("idle.down");
        this.offset = new Vector(0, -10);

        // Update collision box
        this.collider.useBoxCollider(12, 12);

        // Set player z-index
        this.z = Configs.PlayerZIndex;

        this.graphics.onPreDraw = (ctx) => {
            ctx.drawCircle(Vector.Zero, 1, Color.Red);
        };
    }

    onPreUpdate(engine: Engine, delta: number) {
        super.onPreUpdate(engine, delta);

        // Move player
        this.vel = Vector.Zero;
        if (engine.input.keyboard.isHeld(Keys.W) || engine.input.keyboard.isHeld(Keys.Up)) {
            this.vel.y -= Configs.PlayerSpeed;
        }
        if (engine.input.keyboard.isHeld(Keys.S) || engine.input.keyboard.isHeld(Keys.Down)) {
            this.vel.y += Configs.PlayerSpeed;
        }
        if (engine.input.keyboard.isHeld(Keys.A) || engine.input.keyboard.isHeld(Keys.Left)) {
            this.vel.x -= Configs.PlayerSpeed;
        }
        if (engine.input.keyboard.isHeld(Keys.D) || engine.input.keyboard.isHeld(Keys.Right)) {
            this.vel.x += Configs.PlayerSpeed;
        }

        // Set animation
        const direction =
            (this.oldVel.x < 0) ? "left"
                : (this.oldVel.x > 0) ? "right"
                    : (this.oldVel.y < 0) ? "up"
                        : (this.oldVel.y > 0) ? "down"
                            : "down";
        const anim = (this.vel.x === 0 && this.vel.y === 0) ? "idle" : "run";
        this.graphics.use(`${anim}.${direction}`);
    }
}
