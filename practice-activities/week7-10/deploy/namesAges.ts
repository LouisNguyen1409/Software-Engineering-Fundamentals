const namesAges: { name: string, age: number }[] = [];

function dateToAge(timestamp: number) {
  const today = new Date();
  // multiplied by 1000 so that the argument is in milliseconds, not seconds.
  const birthDate = new Date(timestamp * 1000);
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

function getNamesAges(minAge: number) {
  if (minAge == null) {
    return namesAges;
  }
  return namesAges.filter(record => record.age >= minAge);
}

function addNameAge(name: string, dob: number) {
  namesAges.push({
    name: name,
    age: dateToAge(dob)
  });
  return {};
}

function editNameAge(name: string, dob: number) {
  namesAges.forEach((record) => {
    if (record.name === name) {
      record.age = dateToAge(dob);
    }
  });
  return {};
}

function clearNamesAges() {
  while (namesAges.length > 0) {
    namesAges.pop();
  }
  return {};
}

export { getNamesAges, editNameAge, clearNamesAges, addNameAge };
