import {Font, FontUnit, ImageSource, TextAlign} from "excalibur";
// @ts-ignore
import DesertTilemapBlankBackgroundImageSource from './image/DesertTilemapBlankBackground.png';
// @ts-ignore
import DesertTilemapImageSource from './image/DesertTilemap.png';
// @ts-ignore
import PlayerImageSource from './image/player.png';
// @ts-ignore
import SlimeImageSource from './image/slime.png';

export const Resources = {
    image: {
        world: new ImageSource(DesertTilemapImageSource),
        plant: new ImageSource(DesertTilemapBlankBackgroundImageSource),
        player: new ImageSource(PlayerImageSource),
        slime: new ImageSource(SlimeImageSource),
    },
    music: {

    },
    font: {
        normalL: new Font({
            family: 'Arial',
            size: 24,
            unit: FontUnit.Px,
            textAlign: TextAlign.Left,
        }),
        normalR: new Font({
            family: 'Arial',
            size: 24,
            unit: FontUnit.Px,
            textAlign: TextAlign.Right,
        }),
    }
};
