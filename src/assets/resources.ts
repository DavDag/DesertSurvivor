import {ImageSource} from "excalibur";
// @ts-ignore
import WorldTileMapImageSource from './image/DesertTilemapBlankBackground.png';
// @ts-ignore
import PlayerImageSource from './image/Player.png';

export const Resources = {
    image: {
        worldTileMap: new ImageSource(WorldTileMapImageSource),
        player: new ImageSource(PlayerImageSource),
    },
    music: {},
};
