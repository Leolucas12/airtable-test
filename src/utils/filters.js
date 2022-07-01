import { PRICE_OFFSET } from "./priceOptions";

export function filterByText(professionals, text) {
  if (text !== '') {
    const filtered = professionals.filter(function (professional, i) {
      return ((professional.fields.description.includes(text) || professional.fields.headline.includes(text)) || professional.fields.name.includes(text));
    })

    return filtered;
  } else {
    return professionals;
  }
}

export function filterByTags(professionals, tags) {
  if (tags.length > 0) {
    const filtered = professionals.filter(function (professional, i) {
      return (tags.every(r => professional.fields.hashtag.indexOf(r) >= 0));
    })

    return filtered;
  } else {
    return professionals;
  }
}

export function filterByPrice(professionals, price) {
  if (price !== '') {
    const splitPrice = price.split(',')
    let filtered = [];
    if (splitPrice.length > 1) {
      const minPrice = parseInt(splitPrice[0])
      const maxPrice = parseInt(splitPrice[1])
      filtered = professionals.filter(function (professional, i) {
        return (professional.fields.price > minPrice && professional.fields.price < maxPrice);
      })
    } else {
      professionals.sort(function (a, b) { return a.fields.price - b.fields.price });
      const minPrice = professionals[0].fields.price;
      if (parseInt(price) === minPrice + PRICE_OFFSET) {
        filtered = professionals.filter(function (professional, i) {
          return (professional.fields.price <= parseInt(price));
        })
      } else {
        filtered = professionals.filter(function (professional, i) {
          return (professional.fields.price >= parseInt(price));
        })
      }
    }

    return filtered;
  } else {
    return professionals;
  }
}

export function filterByLocalization(professionals, localization) {
  if (localization !== '') {
    const filtered = professionals.filter(function (professional, i) {
      return (professional.fields.localization === localization);
    })

    return filtered;
  } else {
    return professionals;
  }
}

export function filterProfessionals(professionals, text, tags, price, local) {
  const filteredByText = filterByText(professionals, text);
  const filteredByTags = filterByTags(professionals, tags)
  const filteredByPrice = filterByPrice(professionals, price)
  const filteredByLocalization = filterByLocalization(professionals, local)

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
    // remove all entries not seen at least 3 times
    if (count !== 4) {
      filteredObjects.delete(key);
    }
  });

  console.log([...filteredObjects.keys()])
}