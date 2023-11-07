import { FC, PropsWithChildren } from 'react'

export const Page: FC<PropsWithChildren> = (props) => {
  return (
    <div className="page">
      {props.children}
    </div>
  )
}
