import React from 'react'

interface NewLinkModalProps {
  userID?: string | undefined;
}

const NewLinkModal:React.FC<NewLinkModalProps> = ({ userID }) => {

  return (
    <dialog id="new_link_modal" className="modal modal-bottom sm:modal-middle">
      <div className="modal-box bg-white text-black">
        <form method="dialog">
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
        </form>
        <div>
          {userID ? "loggedin" : "noooooo"}
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  )
}

export default NewLinkModal;