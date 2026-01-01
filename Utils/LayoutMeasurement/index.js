// import {Dimensions, PixelRatio} from 'react-native';

// let screenWidth = Dimensions.get('window').width;
// let screenHeight = Dimensions.get('window').height;

// const widthPercentageToDP = widthPercent => {
//   const elemWidth =
//     typeof widthPercent === 'number' ? widthPercent : parseFloat(widthPercent);
//   return PixelRatio.roundToNearestPixel((screenWidth * elemWidth) / 100);
// };


// const { width, height } = Dimensions.get('window');
// const horizontalScale = (size) => (width / guidelineBaseWidth) * size;


// const heightPercentageToDP = heightPercent => {
//   const elemHeight =
//     typeof heightPercent === 'number'
//       ? heightPercent
//       : parseFloat(heightPercent);
//   return PixelRatio.roundToNearestPixel((screenHeight * elemHeight) / 100);
// };

// const removeOrientationListener = () => {
//   Dimensions.removeEventListener('change', () => {});
// };

// const moderateScale = (size, factor = 0.5) => size + (horizontalScale(size) - size) * factor;
// export {widthPercentageToDP, heightPercentageToDP, removeOrientationListener, moderateScale};
import { Dimensions, PixelRatio } from 'react-native';

let screenWidth = Dimensions.get('window').width;
let screenHeight = Dimensions.get('window').height;

const { width, height } = Dimensions.get('window');

const guidelineBaseWidth = 375;
const guidelineBaseHeight = 812;

const horizontalScale = (size) => (width / guidelineBaseWidth) * size;

const widthPercentageToDP = (widthPercent) => {
  const elemWidth = typeof widthPercent === "number" ? widthPercent : parseFloat(widthPercent);
  return PixelRatio.roundToNearestPixel(screenWidth * elemWidth / 100);
};

const heightPercentageToDP = (heightPercent) => {
  const elemHeight = typeof heightPercent === "number" ? heightPercent : parseFloat(heightPercent);
  return PixelRatio.roundToNearestPixel(screenHeight * elemHeight / 100);
};

const moderateScale = (size, factor = 0.5) => size + (horizontalScale(size) - size) * factor;

const removeOrientationListener = () => {
  Dimensions.removeEventListener('change', () => {});
};

export {
  widthPercentageToDP,
  heightPercentageToDP,
  removeOrientationListener,
  moderateScale
};





