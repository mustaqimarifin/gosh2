'use client'
import NextImage from 'next/image'

export const Pic = (props: {
  src: any
  alt: any
  className: any
  caption: any
  width: any
  height: any
}) => {
  const { src, alt, width, height } = props
  const path = require(`../public/images${src}`)
  //const img = src.startsWith('http') ? src : path

  return (
    <NextImage
      src={path}
      alt={alt}
      width={Number(width)}
      height={Number(height)}
      placeholder="blur"
      unoptimized={src.startsWith('http')}
      //className={styles}
    />
  )
}
