import { lazy } from 'react'

export const Question = lazy(() => {
    return Promise.all([
        import("../pages/question"),
        new Promise(resolve => setTimeout(resolve, 0))
      ])
      .then(([moduleExports]) => moduleExports);
    }
)

export const GenericNotFound = lazy(() =>
    import('../pages/error404').then(module => ({
        default: module.Error404,
    })),
)