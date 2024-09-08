import {
    Actor,
    Animation,
    AnimationStrategy, Collider, CollisionContact,
    CollisionType,
    Color,
    Engine,
    Keys,
    range, Shape, Side,
    SpriteSheet,
    Vector
} from "excalibur";
import {Configs} from "../configs";
import {Resources} from "../assets/resources";

export class Player extends Actor {

    private attacking = false;
    private direction = "down";

    private attackActors: { [key: string]: Actor } = {};

    constructor() {
        super({
            name: "player",
            pos: Vector.Zero,
            width: Configs.TileWidth,
            height: Configs.TileHeight,
            color: Color.Violet,
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
        const attackAnimDown = Animation.fromSpriteSheet(
            spriteSheet,
            range(36, 39),
            Configs.PlayerAttackAnimFrameDuration,
            AnimationStrategy.Freeze
        );
        attackAnimDown.events.on("end", this.onAttackAnimationEnd.bind(this));
        const attackAnimRight = Animation.fromSpriteSheet(
            spriteSheet,
            range(42, 45),
            Configs.PlayerAttackAnimFrameDuration,
            AnimationStrategy.Freeze
        );
        attackAnimRight.events.on("end", this.onAttackAnimationEnd.bind(this));
        const attackAnimUp = Animation.fromSpriteSheet(
            spriteSheet,
            range(48, 51),
            Configs.PlayerAttackAnimFrameDuration,
            AnimationStrategy.Freeze
        );
        attackAnimUp.events.on("end", this.onAttackAnimationEnd.bind(this));
        const attackAnimLeft = Animation.fromSpriteSheetCoordinates({
            spriteSheet,
            frameCoordinates: [
                {x: 0, y: 7, duration: Configs.PlayerAttackAnimFrameDuration, options: {flipHorizontal: true}},
                {x: 1, y: 7, duration: Configs.PlayerAttackAnimFrameDuration, options: {flipHorizontal: true}},
                {x: 2, y: 7, duration: Configs.PlayerAttackAnimFrameDuration, options: {flipHorizontal: true}},
                {x: 3, y: 7, duration: Configs.PlayerAttackAnimFrameDuration, options: {flipHorizontal: true}},
            ],
            strategy: AnimationStrategy.Freeze
        });
        attackAnimLeft.events.on("end", this.onAttackAnimationEnd.bind(this));
        this.graphics.add("idle.down", idleAnimDown);
        this.graphics.add("idle.right", idleAnimRight);
        this.graphics.add("idle.up", idleAnimUp);
        this.graphics.add("idle.left", idleAnimLeft);
        this.graphics.add("run.down", runAnimDown);
        this.graphics.add("run.right", runAnimRight);
        this.graphics.add("run.up", runAnimUp);
        this.graphics.add("run.left", runAnimLeft);
        this.graphics.add("attack.down", attackAnimDown);
        this.graphics.add("attack.right", attackAnimRight);
        this.graphics.add("attack.up", attackAnimUp);
        this.graphics.add("attack.left", attackAnimLeft);
        this.graphics.use("idle.down");
        this.offset = new Vector(0, -10);

        // Update collision box
        this.collider.useBoxCollider(12, 12);
        this.attackActors["right"] = new Actor({
            name: "attack",
            pos: new Vector(10, 0),
            width: 20,
            height: 20,
            collisionType: CollisionType.PreventCollision,
        });
        this.attackActors["left"] = new Actor({
            name: "attack",
            pos: new Vector(-10, 0),
            width: 20,
            height: 20,
            collisionType: CollisionType.PreventCollision,
        });
        this.attackActors["up"]= new Actor({
            name: "attack",
            pos: new Vector(0, -10),
            width: 20,
            height: 20,
            collisionType: CollisionType.PreventCollision,
        });
        this.attackActors["down"] = new Actor({
            name: "attack",
            pos: new Vector(0, 10),
            width: 20,
            height: 20,
            collisionType: CollisionType.PreventCollision,
        });
        Object.values(this.attackActors).forEach(this.addChild.bind(this));

        // Set player z-index
        this.z = Configs.PlayerZIndex;

        this.graphics.onPreDraw = (ctx) => {
            if (engine.isDebug) {
                ctx.drawCircle(Vector.Zero, 1, Color.Red);
            }
        };
    }

    onPreUpdate(engine: Engine, delta: number) {
        super.onPreUpdate(engine, delta);

        // Move player
        this.vel = Vector.Zero;
        if (!this.attacking) {
            if (engine.input.keyboard.isHeld(Keys.W) || engine.input.keyboard.isHeld(Keys.Up)) {
                this.vel.y -= 1;
                this.direction = "up";
            }
            if (engine.input.keyboard.isHeld(Keys.S) || engine.input.keyboard.isHeld(Keys.Down)) {
                this.vel.y += 1;
                this.direction = "down";
            }
            if (engine.input.keyboard.isHeld(Keys.A) || engine.input.keyboard.isHeld(Keys.Left)) {
                this.vel.x -= 1;
                this.direction = "left";
            }
            if (engine.input.keyboard.isHeld(Keys.D) || engine.input.keyboard.isHeld(Keys.Right)) {
                this.vel.x += 1;
                this.direction = "right";
            }
            if (this.vel.x !== 0 || this.vel.y !== 0) {
                this.vel = this.vel.normalize().scale(Configs.PlayerSpeed);
            }
        }

        // Attack
        if (engine.input.keyboard.wasPressed(Keys.Space) && !this.attacking) {
            this.attacking = true;
            this.attackActors[this.direction].body.collisionType = CollisionType.Passive;
            (this.graphics.getGraphic(`attack.${this.direction}`) as Animation).reset();
        }

        // Set animation
        const anim =
            (this.attacking) ? "attack"
                : (this.vel.x === 0 && this.vel.y === 0) ? "idle"
                    : "run";
        this.graphics.use(`${anim}.${this.direction}`);
    }

    onCollisionStart(self: Collider, other: Collider, side: Side, contact: CollisionContact) {
        super.onCollisionStart(self, other, side, contact);
        console.debug(`Player collided with ${other.owner.name} on ${side}`);
    }

    private onAttackAnimationEnd() {
        this.attacking = false;
        this.attackActors[this.direction].body.collisionType = CollisionType.PreventCollision;
    }
}
