export function stringDateToTimestamp(dateString: string): number {
  const tempDateType = new Date(dateString);
  const resultTimeStamp = tempDateType.getTime();
  return resultTimeStamp;
}
