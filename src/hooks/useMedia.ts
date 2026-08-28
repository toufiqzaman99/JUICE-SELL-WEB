import { useEffect, useState } from 'react'

/** True only on fine-pointer (mouse/trackpad) viewports — used to gate
 *  cursor-following effects, 3D tilt and magnetic buttons. */
export function useFinePointer(): boolean {
  const [fine, setFine] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(pointer: fine)')
    const update = () => setFine(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  return fine
}

/** True below a breakpoint — cheap responsive gate for effects. */
export function useIsMobile(breakpoint = 768): boolean {
  const [mobile, setMobile] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpoint - 1}px)`)
    const update = () => setMobile(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [breakpoint])

  return mobile
}
