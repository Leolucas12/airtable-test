import { useCallback, useEffect, useState } from 'react';
import Professional from '../components/Professional';
import api from '../services/api';
import { filterByLocalization, filterByPrice, filterByTags, filterByText } from '../utils/filters';
import priceOptions from '../utils/priceOptions';

export default function ProfessionalsList() {
  const [allProfessionals, setAllProfessionals] = useState([]);
  const [filteredProfessionals, setFilteredProfessionals] = useState([]);
  const [localizations, setLocalizations] = useState([])
  const [priceRanges, setPriceRanges] = useState([])
  const [formState, setFormState] = useState({
    text: '',
    tags: [],
    price: '',
    local: ''
  });

  useEffect(() => {
    api.get()
      .then(({ data }) => {
        setAllProfessionals(data.records)
        setFilteredProfessionals(data.records)
        const tempLocalizations = []
        const tempPriceOptions = []
        for (let i = 0; i < data.records.length; i++) {
          tempLocalizations.push(data.records[i].fields.localization);
          tempPriceOptions.push(Math.ceil(data.records[i].fields.price));
        }
        setLocalizations(tempLocalizations);
        setPriceRanges(priceOptions(tempPriceOptions))
      })
      .catch(() => {

      })
  }, [])

  const onChange = useCallback((e) => {
    e.preventDefault();
    const { name, value } = e.target;
    setFormState((prevState) => ({ ...prevState, [name]: value }));
  }, [])

  const tagSelected = useCallback((tag) => {
    const currentTags = formState.tags;
    if (currentTags.indexOf(tag) > -1) {
      return true;
    } else {
      return false;
    }
  }, [formState])

  const setTags = useCallback((tag) => {
    const currentTags = formState.tags;
    if (tagSelected(tag)) {
      const index = currentTags.indexOf(tag);
      currentTags.splice(index, 1);
      setFormState((prevState) => ({ ...prevState, tags: currentTags }))
    } else if (tag !== '') {
      currentTags.push(tag)
      setFormState((prevState) => ({ ...prevState, tags: currentTags }))
    } else {
      setFormState((prevState) => ({ ...prevState, tags: [] }))
    }
  }, [formState.tags, tagSelected])

  const filterProfessionals = useCallback(() => {
    const filteredByText = filterByText(allProfessionals, formState.text);
    const filteredByTags = filterByTags(allProfessionals, formState.tags)
    const filteredByPrice = filterByPrice(allProfessionals, formState.price)
    const filteredByLocalization = filterByLocalization(allProfessionals, formState.local)

    const filteredObjects = new Map();

    const updateObjects = arr => {
      arr.forEach(entry => {
        if (!filteredObjects.has(entry)) {
          filteredObjects.set(entry, 1);
        } else {
          let timesSeen = filteredObjects.get(entry);
          filteredObjects.set(entry, ++timesSeen);
        }
      });
    };

    updateObjects(filteredByText);
    updateObjects(filteredByTags);
    updateObjects(filteredByPrice);
    updateObjects(filteredByLocalization);

    filteredObjects.forEach((count, key) => {
      // remove all entries not seen at least 4 times
      if (count !== 4) {
        filteredObjects.delete(key);
      }
    });


    const filteredProfessionals = [...filteredObjects.keys()]
    console.log(filteredProfessionals)
    setFilteredProfessionals(filteredProfessionals)
  }, [formState, allProfessionals])

  useEffect(() => {
    filterProfessionals()
  }, [formState, filterProfessionals])

  return (
    <div className="container my-5">
      <div className="row">
        <div className="col-12">
          <div className="filtering text-center text-uppercase">
            <span onClick={() => setTags('')} className={`${formState.tags.length === 0 ? 'active' : ''}`}>Todos</span>
            <span onClick={() => setTags('Back-end')} className={`${tagSelected('Back-end') ? 'active' : ''}`}>Back-end</span>
            <span onClick={() => setTags('Copy')} className={`${tagSelected('Copy') ? 'active' : ''}`}>Copy</span>
            <span onClick={() => setTags('Digital Product Designer')} className={`${tagSelected('Digital Product Designer') ? 'active' : ''}`}>Digital Product Designer</span>
            <span onClick={() => setTags('Front-end')} className={`${tagSelected('Front-end') ? 'active' : ''}`}>Front-end</span>
            <span onClick={() => setTags('UX/UI')} className={`${tagSelected('UX/UI') ? 'active' : ''}`}>UX/UI</span>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-12 col-lg-3">
          <h3 className="mt-5">Filtros</h3>
          <hr />
          <form>
            <div className="form-group">
              <input type="text" className="form-control" name="text" value={formState.text} onChange={onChange} placeholder="Filtrar por texto"></input>
            </div>

            <hr />

            <div className="form-check">
              <input checked={tagSelected('Back-end')} onChange={() => setTags('Back-end')} className="form-check-input" type="checkbox" id="Back-end"></input>
              <label className="form-check-label" htmlFor="Back-end">
                Back-end
              </label>
            </div>
            <div className="form-check">
              <input checked={tagSelected('Copy')} onChange={() => setTags('Copy')} className="form-check-input" type="checkbox" id="Copy"></input>
              <label className="form-check-label" htmlFor="Copy">
                Copy
              </label>
            </div>
            <div className="form-check">
              <input checked={tagSelected('Digital Product Designer')} onChange={() => setTags('Digital Product Designer')} className="form-check-input" type="checkbox" id="DigitalProductDesigner"></input>
              <label className="form-check-label" htmlFor="DigitalProductDesigner">
                Digital Product Designer
              </label>
            </div>
            <div className="form-check">
              <input checked={tagSelected('Front-end')} onChange={() => setTags('Front-end')} className="form-check-input" type="checkbox" id="Front-end"></input>
              <label className="form-check-label" htmlFor="Front-end">
                Front-end
              </label>
            </div>
            <div className="form-check">
              <input checked={tagSelected('UX/UI')} onChange={() => setTags('UX/UI')} className="form-check-input" type="checkbox" id="UX/UI"></input>
              <label className="form-check-label" htmlFor="UX/UI">
                UX/UI
              </label>
            </div>

            <hr />

            <label htmlFor="price">Preço</label>
            <select name="price" onChange={onChange} value={formState.price} className="custom-select mr-sm-2" >
              <option value="">Selecionar...</option>
              <option value={`${priceRanges[0]}`}>Abaixo de R${priceRanges[0]}</option>
              {priceRanges.map((price, index) => {
                if (index !== 0 && index !== priceRanges.length - 1) {
                  return <option key={`${price}`} value={[price]}>R${price[0]} até R${price[1]}</option>
                } else {
                  return null;
                }
              })}
              <option value={`${priceRanges[priceRanges.length - 1]}`}>Acima de R${priceRanges[priceRanges.length - 1]}</option>
            </select>

            <hr />

            <label htmlFor="localization">Localização</label>
            <select name="local" onChange={onChange} value={formState.local} className="custom-select mr-sm-2" id="localization">
              <option value="" >Selecionar...</option>
              {localizations.map((local) => (
                <option key={local} value={local}>{local}</option>
              ))}
            </select>
          </form>
        </div>
        <div className="col-12 col-lg-9">
          <div className="form-row gallery mt-5">
            {filteredProfessionals.map((professional) => (
              <Professional key={professional.id} professionalData={professional.fields} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}