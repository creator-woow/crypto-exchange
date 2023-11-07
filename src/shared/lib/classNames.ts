export const cn = (
  staticClasses?: (string | undefined)[],
  dynamicClasses?: Record<string, boolean>
  ): string => {
    return [
      staticClasses?.join(" "),
      !dynamicClasses ? "" : (
        Object
          .entries(dynamicClasses)
          .reduce((result, entry) => {
            const [className, condition] = entry;
            if (condition) {
              return `${result} ${className}`
            }
            return result
          }, "")
      )
    ].join(" ")
};
