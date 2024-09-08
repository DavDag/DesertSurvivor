import {Font, FontUnit, ImageSource, Sound, TextAlign} from "excalibur";
// @ts-ignore
import DesertTilemapBlankBackgroundImageSource from './image/DesertTilemapBlankBackground.png';
// @ts-ignore
import DesertTilemapImageSource from './image/DesertTilemap.png';
// @ts-ignore
import PlayerImageSource from './image/player.png';
// @ts-ignore
import SlimeImageSource from './image/slime.png';
// @ts-ignore
import SlimeDiesSound from './music/slime-dies.wav';
// @ts-ignore
import SlimeLandingSound from './music/slime-landing.wav';
// @ts-ignore
import SlimeSpawnSound from './music/slime-spawn.ogg';
// @ts-ignore
import PickUpSound from './music/pickup.wav';
// @ts-ignore
import SwordSwingSound from './music/sword-swing.wav';
// @ts-ignore
import FootStep1Sound from './music/01-footstep.ogg';
// @ts-ignore
import FootStep2Sound from './music/02-footstep.ogg';

export const Resources = {
    image: {
        World: new ImageSource(DesertTilemapImageSource),
        Plant: new ImageSource(DesertTilemapBlankBackgroundImageSource),
        Player: new ImageSource(PlayerImageSource),
        Slime: new ImageSource(SlimeImageSource),
    },
    music: {
        SlimeDies: new Sound(SlimeDiesSound),
        SlimeLanding: new Sound(SlimeLandingSound),
        SlimeSpawn: new Sound(SlimeSpawnSound),
        PickUp: new Sound(PickUpSound),
        SwordSwing: new Sound(SwordSwingSound),
        FootStep1: new Sound(FootStep1Sound),
        FootStep2: new Sound(FootStep2Sound),
    },
    font: {
        NormalL: new Font({
            family: 'Arial',
            size: 24,
            unit: FontUnit.Px,
            textAlign: TextAlign.Left,
        }),
        NormalR: new Font({
            family: 'Arial',
            size: 24,
            unit: FontUnit.Px,
            textAlign: TextAlign.Right,
        }),
    }
};
