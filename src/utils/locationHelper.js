// check if point is in area or not
export function arePointsNear(checkPoint, centerPoint, km) {
  // console.log("checkPoint: ", checkPoint);
  // console.log("centerPoint: ", centerPoint);
  // console.log("km: ", km);
  var ky = 40000 / 360;
  var kx = Math.cos((Math.PI * centerPoint.latitude) / 180.0) * ky;
  var dx = Math.abs(centerPoint.longitude - checkPoint.longitude) * kx;
  var dy = Math.abs(centerPoint.latitude - checkPoint.latitude) * ky;
  return Math.sqrt(dx * dx + dy * dy) <= km;
}
