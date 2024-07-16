import React from 'react'
import './DescriptionBox.css'
const DescriptionBox = () => {
  return (
    <div className='descriptionbox'>
      <div className="descriptionbox-navigator">
        <div className="descriptionbox-nav-box">Description</div>
        <div className="descriptionbox-nav-box fade">Reviews (122)</div>
      </div>
      <div className="descriptionbox-description">
        <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Soluta delectus minima aperiam, omnis voluptatem similique asperiores tempora libero facilis voluptates fugit excepturi deleniti commodi eum in quae sit rerum sunt a voluptatum dolores possimus earum autem! Quae quaerat qui quam voluptatem eligendi, quas minima maxime atque asperiores, est cum dolorum?</p>
        <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Nulla voluptate, veritatis quod error dolores, maiores consectetur quaerat est rerum, perferendis adipisci unde fugiat vel odio eaque corporis similique nihil ratione?
        </p>
      </div>
    </div>
  )
}

export default DescriptionBox