
export default function Professional({ professionalData }) {
  return (
    <div className="col-12 col-lg-6 mb-2 copy ux-ui">
      <div className="card">
        <img className="card-img-top" src={professionalData.image[0].thumbnails.large.url} alt={professionalData.name} />
        <div className="card-body">
          <h4 className="card-title">{professionalData.name}</h4>
          <h6>{professionalData.headline}</h6>

          {professionalData.hashtag.map((tag) => (
            <span key={tag} className="badge badge-secondary">{tag}</span>
          ))}

          <hr />

          <p className="card-text">{professionalData.description}</p>

          <h5>R${parseInt(professionalData.price).toFixed(2)}</h5>
          <p className="card-text">
            <small className="text-muted">{professionalData.localization} - {new Date(professionalData.date.replace(/-/g, '/')).toLocaleDateString()}</small>
          </p>

          <h6>Equipe</h6>
          <ul className="list-inline">
            {professionalData.photos.map((photo) => (
              <li key={photo.id} className="list-inline-item"><img src={photo.thumbnails.large.url} alt="avatar" width="60" className="img-fluid" /></li>
            ))}
          </ul>

          <button className="btn btn-block btn-success">Agende um horário</button>
        </div>
      </div>
    </div>
  )
}