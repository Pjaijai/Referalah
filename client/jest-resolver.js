module.exports = (path, options) => {
  // Call the default resolver
  return options.defaultResolver(path, {
    ...options,
    // You can add custom extensions here if needed
    packageFilter: (pkg) => {
      if (pkg.module) {
        pkg.main = pkg.module
      }
      return pkg
    },
  })
}
