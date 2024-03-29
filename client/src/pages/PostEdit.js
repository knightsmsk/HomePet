import { useState, useEffect, useRef } from 'react';
import useSynState from '../hooks/useSynState';
import useDebounce from '../hooks/useDebounce';
import { toast } from 'react-toastify';
import { Form, useNavigate, useLoaderData } from 'react-router-dom';
import {
  CustomDropdownIcon,
  control,
  breedStyles,
  ageStyle,
} from '../components/post/selectStyle';
import '../CSS/PostEdit.css';
import Select from 'react-select';
import ClipLoader from 'react-spinners/ClipLoader';
import NotFound from '../components/NotFound';

const PostEdit = () => {
  const navigate = useNavigate();
  const searchInputElement = useRef();
  const [oldPostData, setOldPostData] = useState(useLoaderData());

  const [{ petIcon, petType }, setPetType] = useState({
    petIcon: oldPostData.type,
    petType: oldPostData.type,
  });

  document.addEventListener('click', (e) => {
    let petType = document.querySelector('.selector-petType .selector.field');
    let Topic = document.querySelector('.topic-field');
    if (petType) {
      if (petType.classList.contains('active') && !petType.contains(e.target)) {
        petType.classList.remove('active');
      }
    }
    if (Topic) {
      if (Topic.classList.contains('active') && !Topic.contains(e.target)) {
        Topic.classList.remove('active');
      }
    }
  });

  const [petName, setPetName] = useState(oldPostData.name);
  const [petGender, setPetGender] = useState(oldPostData.gender);
  const [details, setDetails] = useState(oldPostData.details);

  const [selectBreed, setBreed] = useState(oldPostData.breed);
  const [selectMonth, setMonth] = useState(oldPostData.ageMonth);
  const [selectYear, setYear] = useState(oldPostData.ageYear);

  var [countName, setCountName] = useState(petName.length);
  var [countDetails, setCountDetails] = useState(details.length);

  const [uploadImage, setUploadImage] = useState([]);
  const [userImage, setUserImage] = useState([]);

  const selectedTopic = useSynState(oldPostData.topic);
  const AllTopic = useSynState([]);
  const [searchInput, setSearchInput] = useState('');
  const debouncedSearch = useDebounce(searchInput, 500);

  useEffect(() => {
    SearchTopic(debouncedSearch);
    // eslint-disable-next-line
  }, [debouncedSearch]);

  // fetch breeds data
  useEffect(() => {
    fetchBreeds(petType);
  }, [petType]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await LoadTopicData();
      AllTopic.set(data);
      // console.log(AllTopic.get());
    };

    fetchData();
  }, []);

  const [{ breedsLoading, searchLoading }, setLoading] = useState({
    breedsLoading: false,
    searchLoading: false,
  });
  const [breeds, setDataBreeds] = useState([]);

  const handleBreedChange = (selected) => {
    setBreed(selected);
  };
  const handleMonthChange = (selected) => {
    setMonth(selected);
  };
  const handleYearChange = (selected) => {
    setYear(selected);
  };

  const handleSelectTopic = (topic) => {
    if (selectedTopic.get().length < 3) {
      selectedTopic.set(selectedTopic.get().concat(topic));
      if (!topic.new) {
        AllTopic.set(
          AllTopic.get().filter((data) => data.topic !== topic.topic)
        );
      }
      if (searchInput !== '') setSearchInput('');
    } else {
      toastError('The maximum number of topics that can be added is 3.');
    }
  };

  const handleInputRange = (event, typeInput, limit) => {
    const { value } = event.target;
    if (typeInput === 'name')
      event.target.value = value.replace(new RegExp('. $'), '');
    if (value.length > limit) {
      if (typeInput === 'name') {
        setCountName(limit);
      } else {
        setCountDetails(limit);
      }
      event.target.value = value.slice(0, limit);
    } else {
      let length = value.length;
      if (typeInput === 'name') {
        if (value.includes('.')) length = length - 2;
        setCountName(length);
      } else {
        setCountDetails(length);
      }
    }
  };

  const SearchTopic = async (search) => {
    try {
      await fetch(`/api/topic?search=${search}`, {
        method: 'POST',
        body: JSON.stringify({
          select: selectedTopic.get().map((item) => item.topic),
        }),
        headers: new Headers({ 'Content-Type': 'application/json' }),
      })
        .then((res) => {
          if (!res.ok) throw Error({ error: 'Could not search topic' });
          return res.json();
        })
        .then((data) => AllTopic.set(data));
    } catch (error) {
      console.error('Error search topic', error);
    }

    setLoading({ searchLoading: false });
  };

  const handleFileImage = (e) => {
    const uploadImgs = e.target.files;

    const uploadImgsArray = Array.from(uploadImgs);
    const images = uploadImgsArray.map((image) => {
      return URL.createObjectURL(image);
    });

    setUserImage((previousImage) => previousImage.concat(uploadImgsArray));

    setUploadImage((previousImage) => previousImage.concat(images));
  };

  const fetchBreeds = async (type) => {
    setLoading({ breedsLoading: true });
    const res = await fetch(`/api/pet/breeds/${type}`);
    let breeds = await res.json();
    if (!res.ok) {
      throw Error(breeds.error);
    }
    setTimeout(() => {
      setLoading({ breedsLoading: false });
    }, 500);
    setDataBreeds(breeds);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const currentDate = new Date().toISOString();
    const formData = new FormData(e.target);

    if (!formData.get('name')) {
      toastError('Please enter a name pet!');
    } else if (!petIcon) {
      toastError('Please select a type of pet!');
    } else if (!selectBreed) {
      toastError(`Please select a ${petType}'s breed`);
    } else if (!petGender) {
      toastError("Please select a pet's gender!");
      // } else if (!selectYear || !selectMonth) {
      //   toastError('Please select the age of the pet!');
    } else if (selectYear['value'] === 0 && selectMonth['value'] === 0) {
      toastError("Age's pet invalid. ERROR: year is 0 and month is 0");
    } else if (!details) {
      toastError('Please enter the description');
      // } else if (userImage.length === 0) {
      //   toastError('Please upload a picture of your pet');
    } else {
      // const imgData = new FormData();
      // const id = createID() + createID();

      // for (let i = 0; i < userImage.length; i++) {
      //   imgData.append('files', userImage[i]);
      // }

      // const URL = await uploadImageToServer(imgData);

      const PetData = {
        // image_src: URL.map((img) => `/api/images/${img}`),
        name: petName,
        type: petType,
        breed: selectBreed['value'] || '',
        details: details,
        ageMonth: selectMonth['value'] || '',
        ageYear: selectYear['value'] || '',
        gender: petGender,
        adopted: false,
        dateTime: currentDate,
        // topic: selectedTopic.get().map((topic) => {
        //   return topic.topic;
        // }),
      };

      // await AddTopic(selectedTopic.get());
      await EditPost(PetData, oldPostData.PetID);
      toastSuccess('Edit post successfully!');
      navigate('/adopt', { replace: true });
    }
  };

  const [modal, setModal] = useState(false);

  const toggleModal = () => {
    setModal(!modal);
  };

  if (modal) {
    document.body.classList.add('active-modal');
  } else {
    document.body.classList.remove('active-modal');
  }

  return (
    <div className='pages-container'>
      <div className='page-title'>
        <span>Post</span>
      </div>
      <Form className='post-form' replace onSubmit={handleSubmit}>
        <div className='information-pet'>
          <p className='Heading'>Information Pet</p>
          <div className='infor-field'>
            <label className='name-field'>
              <p>
                Name <span className='subtitle'>(required)</span>
              </p>
              <div
                className={`label-name field ${
                  countName > 0 ? 'inputing' : ''
                }`}
              >
                <input
                  type='text'
                  placeholder='Please enter name'
                  name='name'
                  autoComplete='off'
                  onChange={(e) => {
                    handleInputRange(e, 'name', 15);
                    setPetName(e.target.value);
                  }}
                  onKeyDown={(e) => {
                    manageInput(e);
                  }}
                  value={petName}
                />
                <span>{`${countName}/15`}</span>
              </div>
            </label>
            <div className='line'></div>
            <div className='petType-field' pet={petIcon}>
              <p>
                Select Pet Type <span className='subtitle'>(required)</span>
              </p>
              <div className='selector-petType'>
                <div
                  className='selector field'
                  select={petIcon !== '' ? 'true' : 'false'}
                  onClick={(e) => {
                    e.currentTarget.classList.toggle('active');
                  }}
                >
                  <i className={`icon-${petIcon}`}></i>
                  <span className={petType}>{petType}</span>
                  <i className='icon-up'></i>
                </div>
                <div className='dropdown-petType'>
                  <ul>
                    {TypeoFPet.map((data, key) => {
                      return (
                        <li
                          key={`typePet${key}`}
                          dropdown-name={data.name}
                          onClick={async (e) => {
                            let valueType =
                              e.currentTarget.children[1].innerHTML;
                            setPetType({
                              petIcon: valueType,
                              petType: valueType,
                            });
                            if (selectBreed) setBreed(null);
                            fetchBreeds(valueType);
                          }}
                        >
                          <i className={`icon-${data.icon}`}></i>
                          <span className='pet-text'>{data.name}</span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            </div>
            {breedsLoading ? (
              <ClipLoader
                color='#f3c79e'
                loading
                size={24}
                cssOverride={{
                  bottom: '0.6rem',
                  margin: '0 5rem',
                  display: 'block',
                  position: 'relative',
                }}
              />
            ) : (
              <>
                <div className='line'></div>
                <Select
                  className='petInfo-select-container'
                  classNamePrefix='petInfo-select'
                  components={{
                    Control: control,
                    DropdownIndicator: CustomDropdownIcon,
                  }}
                  styles={breedStyles}
                  placeholder='Select Pet Breed'
                  onChange={handleBreedChange}
                  options={breeds}
                  menuPortalTarget={document.body}
                  isSearchable
                  defaultValue={
                    selectBreed
                      ? { label: selectBreed, value: selectBreed }
                      : undefined
                  }
                />
              </>
            )}
          </div>
        </div>
        <div className='gender_age'>
          <div className='gender'>
            <p className='title'>
              Gender <span className='subtitle'>(required)</span>{' '}
            </p>
            <div className='gender-select'>
              <input
                type='radio'
                id='Male'
                name='gender'
                value='male'
                checked={petGender === 'male'}
                onChange={() => setPetGender('male')}
              />
              <label htmlFor='Male'>Male</label>
              <input
                type='radio'
                id='Female'
                name='gender'
                value='female'
                checked={petGender === 'female'}
                onChange={() => setPetGender('female')}
              />
              <label htmlFor='Female'>Female</label>
            </div>
          </div>
          <div className='line'></div>
          <div className='age'>
            <p className='title'>
              Age <span className='subtitle'>Year - Month (required)</span>
            </p>
            <div className='age-select'>
              <Select
                className='petInfo-select-container'
                classNamePrefix='petInfo-select'
                components={{
                  Control: control,
                  DropdownIndicator: CustomDropdownIcon,
                }}
                placeholder='Year'
                styles={ageStyle}
                onChange={handleYearChange}
                options={manageMonthYear('year')}
                menuPortalTarget={document.body}
                isSearchable
                defaultValue={{ label: selectYear, value: selectYear }}
              />
              <Select
                className='petInfo-select-container'
                classNamePrefix='petInfo-select'
                components={{
                  Control: control,
                  DropdownIndicator: CustomDropdownIcon,
                }}
                defaultValue={{ label: selectMonth, value: selectMonth }}
                placeholder='Month'
                styles={ageStyle}
                onChange={handleMonthChange}
                options={manageMonthYear('month')}
                menuPortalTarget={document.body}
                isSearchable
              />
            </div>
          </div>
        </div>
        <label className='description'>
          <p>
            Description <span className='subtitle'>(required)</span>
          </p>
          <div className={`desc-input ${countDetails > 0 ? 'inputing' : ''}`}>
            <textarea
              name='details'
              // rows={5}
              // cols={100}
              placeholder='Please enter text'
              onInput={(e) => {
                e.target.style.height = '5px';
                e.target.style.height = e.target.scrollHeight + 'px';
              }}
              onChange={(e) => {
                handleInputRange(e, 'details', 1000);
                setDetails(e.target.value);
              }}
              value={details}
            />
            <p>{`${countDetails}/1000`}</p>
          </div>
        </label>
        {/* <div className='uploadImg'>
          <p>
            Upload an image <span className='subtitle'>(required)</span>
          </p>
          <span className='subtitle'>
            We will use first image to profile of card | require image (JPG,
            PNG, JPEG, GIF, with a width and height of at least 160 pixels)
          </span>
          <div className='pet-img'>
            {uploadImage &&
              uploadImage.map((image, key) => {
                return (
                  <div key={`${image}_${key}`} className='preview-img'>
                    <div className='img'>
                      <img src={image} alt='upload' />
                      <i
                        className='icon-delete'
                        onClick={() => {
                          let index = uploadImage.findIndex((e) => e === image);
                          if (index > -1) {
                            setUploadImage(
                              uploadImage.filter((e, i) => i !== index)
                            );
                            setUserImage(
                              userImage.filter((e, i) => i !== index)
                            );
                          }
                        }}
                      ></i>
                    </div>
                  </div>
                );
              })}
            <label className='upload'>
              <input
                className='upload-image'
                type='file'
                name='images'
                multiple
                accept='image/jpg, image/png, image/jpeg, image/gif'
                onChange={handleFileImage}
                style={{ display: 'none' }}
              />
              <img
                src='https://knightsmsk.github.io/HomePetResource/default%20img/picture.png'
                alt=''
              />
            </label>
          </div>
          <ul className='list-img'></ul>
        </div>
        <div className='addTopic'>
          <p>Add topic</p>
          <div className='topic-field'>
            <ul className='list-topic'>
              {selectedTopic.get() &&
                selectedTopic.get().map((item, key) => {
                  return (
                    <li key={`selectTopic_${key}`} className='topic'>
                      <span>{item.topic}</span>
                      <i
                        className='icon-close'
                        onClick={() => {
                          if (!item.new)
                            AllTopic.set(AllTopic.get().concat(item));
                          selectedTopic.set(
                            selectedTopic
                              .get()
                              .filter((e) => e.topic !== item.topic)
                          );
                          AllTopic.get().sort((a, b) => b.used - a.used);
                        }}
                      ></i>
                    </li>
                  );
                })}
              <div className='input-topic-field'>
                <input
                  ref={searchInputElement}
                  type='text'
                  name='topic'
                  autoComplete='off'
                  onFocus={(e) =>
                    document
                      .querySelector('.topic-field')
                      .classList.add('active')
                  }
                  onChange={(e) => {
                    setSearchInput(
                      e.target.value.replace(new RegExp('. $'), '')
                    );
                    setLoading({ searchLoading: true });
                  }}
                  onKeyDown={(e) => {
                    manageInput(e, true);
                  }}
                />
              </div>
            </ul>
            <div
              className='filter-topic'
              searching={searchInput === '' ? 'false' : 'true'}
            >
              <p className='filter-title'></p>
              <ul className='select-topic'>
                {searchLoading ? (
                  <ClipLoader
                    color='#f3c79e'
                    loading
                    size={24}
                    cssOverride={{
                      margin: '1rem',
                      display: 'block',
                      position: 'relative',
                    }}
                  />
                ) : searchInput.length >= 0 && searchInput.length <= 18 ? (
                  <>
                    {AllTopic.get().filter(
                      (topic) =>
                        topic.topic.toLowerCase() === searchInput.toLowerCase()
                    ).length === 0 &&
                      searchInput !== '' && (
                        <li
                          key={searchInput}
                          className='new'
                          onClick={(e) => {
                            handleSelectTopic({
                              topic: searchInput,
                              used: 0,
                              new: true,
                            });
                            setSearchInput('');
                            searchInputElement.current.value = '';
                          }}
                        >
                          <div className='new-topic'>
                            <span>{searchInput}</span>
                            <i className='icon-plus'></i>
                          </div>
                        </li>
                      )}
                    {AllTopic.get().length > 0 &&
                      AllTopic.get().map((item, key) => {
                        return (
                          <li
                            key={`list_topic_${key}`}
                            onClick={(e) => {
                              handleSelectTopic(item);
                              setSearchInput('');
                              searchInputElement.current.value = '';
                            }}
                          >
                            <div className='topic-name'>
                              {searchInput.length > 0 ? (
                                <>
                                  {splitSentencesByWord(
                                    item.topic,
                                    searchInput
                                  ).map((word, key) => {
                                    if (word !== '') {
                                      return (
                                        <span
                                          key={`word_${key}`}
                                          className={
                                            word.toLowerCase() ===
                                              searchInput.toLowerCase()
                                              ? 'mark'
                                              : null
                                          }
                                        >
                                          {word}
                                        </span>
                                      );
                                    } else return null;
                                  })}
                                </>
                              ) : (
                                <span>{item.topic}</span>
                              )}
                            </div>
                            <div className='topic-used'>
                              <span>{formatNumber(item.used)}</span>
                            </div>
                          </li>
                        );
                      })}
                  </>
                ) : (
                  <NotFound />
                )}
              </ul>
            </div>
          </div>
        </div>
          */}
        <div className='btn-submit'>
          <div onClick={toggleModal} className='btn-submit-publish'>
            Publish
          </div>
        </div>
        {modal && (
          <div className='modal'>
            <div onClick={toggleModal} className='overlay'></div>
            <div className='modal-content'>
              <div className='modal-upper'>
                <div className='modal-image'>
                  <img
                    src='https://cdn.pixabay.com/photo/2012/04/12/22/25/warning-sign-30915__340.png'
                    alt='alert'
                  />
                </div>
                <div className='modal-message'>
                  <h1>Save edit post?</h1>
                  <p>
                    This post will be edited and you won't be able to recover it
                    anymore. This process <b>cannot</b> be undone.
                  </p>
                </div>
              </div>
              <div className='modal-button'>
                <button onClick={toggleModal} className='cancel'>
                  Cancel
                </button>
                <button type='submit' className='edit'>
                  Save
                </button>
              </div>
              <i className='icon-close close-modal' onClick={toggleModal}></i>
            </div>
          </div>
        )}
      </Form>
    </div>
  );
};

export default PostEdit;

const AddTopic = async (newTopic) => {
  try {
    let response = await fetch('/api/topic/add', {
      method: 'POST',
      body: JSON.stringify(newTopic.map((item) => item.topic)),
      headers: new Headers({ 'Content-Type': 'application/json' }),
    }).then((res) => {
      if (!res.ok) {
        throw Error({ error: `Could not add new topic: ${newTopic}` });
      }
      return res.json();
    });
    return response;
  } catch (error) {
    console.error('Error adding new topic', error);
  }
};

const EditPost = async (newPet, id) => {
  const manage = Object.fromEntries(
    Object.entries(newPet).filter(([_, value]) => value)
  );
  try {
    let response = await fetch(`/api/pet/${id}`, {
      method: 'PUT',
      body: JSON.stringify(newPet),
      headers: new Headers({ 'Content-Type': 'application/json' }),
    }).then((res) => {
      if (!res.ok) {
        throw Error({ error: `Could not edit post: ${newPet}` });
      }
      return res.json();
    });
    return response;
  } catch (error) {
    console.error('Error editing post', error);
  }
};

const uploadImageToServer = async (images) => {
  try {
    return fetch(`/api/uploadsImg`, {
      method: 'POST',
      body: images,
    })
      .then((res) => res.json())
      .then((status) => {
        console.log(status.success);
        return status.filesIds;
      });
  } catch (error) {
    console.error('Error to upload image!', error);
  }
};

export const LoadTopicData = async () => {
  const res = await fetch('/api/topic');
  if (!res.ok) {
    throw Error('Could not fetch topic');
  }
  return res.json();
};

const TypeoFPet = [
  { icon: 'dog', name: 'dog' },
  { icon: 'cat', name: 'cat' },
];

const createID = () =>
  Math.random().toString(36).substring(2, 13).toUpperCase();

const manageMonthYear = (fill) => {
  if (fill === 'year') {
    var year = [];
    for (let i = 0; i <= 15; i++) {
      year.push({ value: i, label: i });
    }
    return year;
  } else {
    var month = [];
    for (let i = 0; i < 12; i++) {
      month.push({ value: i, label: i });
    }
    return month;
  }
};

const toastError = (message) => {
  toast.warn(message, {
    position: 'top-center',
    autoClose: 4000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: 'colored',
  });
};

const manageInput = (e, number = false) => {
  const pattern = !number ? /^[a-zA-Zก-์]+$/ : /^[a-zA-Zก-์0-9]+$/;
  if (!pattern.test(e.key)) {
    e.preventDefault();
  }
};

const splitSentencesByWord = (sentence, word) => {
  const pattern = new RegExp(`(${word})`, 'i');
  return sentence.split(pattern);
};

function formatNumber(num) {
  if (num >= 100000) {
    return (
      (num / 100000).toLocaleString(undefined, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 1,
      }) + 'K'
    );
  } else if (num >= 1000000) {
    return (
      (num / 1000000).toLocaleString(undefined, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 1,
      }) + 'M'
    );
  } else return num.toLocaleString();
}

const toastSuccess = (message) => {
  toast.success(message, {
    position: 'top-center',
    autoClose: 4000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: 'colored',
  });
};
