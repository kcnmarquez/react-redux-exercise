import React from 'react';
import { EnvelopeFill, ExclamationTriangleFill, TelephoneFill } from 'react-bootstrap-icons';
import { useDispatch, useSelector } from 'react-redux';
import './UserList.css';
import { userActions } from './store/users.slice';

function UserList() {
  const users = useSelector((state) => state.users.list);
  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(userActions.getAll());
  }, [dispatch]);

  return (
    <div className="container p-4 text-center">
      <div className="row mb-4">
        <h1>Users</h1>
      </div>
      <div className={`row ${users?.error ? '': 'gy-4'}`}>
        {users?.error &&
          <div className="alert alert-danger m-0" role="alert">
            <ExclamationTriangleFill className="me-2" size={24} />
            Failed to load users. Please try again.
          </div>
        }
        {users?.value?.map(user => {
          return (
            <div className="col-lg-4 col-md-6 col-12" key={user.id}>
              <div className="card h-100">
                <div className="card-body gap-2 p-0 my-4 d-flex flex-column justify-content-center">
                  <h2>{user.name}</h2>
                  <div className="d-flex align-items-center justify-content-center">
                    <EnvelopeFill className="me-2" />
                    <p className="text-muted mb-0">{user.email}</p>
                  </div>
                  <div className="d-flex align-items-center justify-content-center">
                    <TelephoneFill className="me-2" />
                    <p className="text-muted mb-0">{user.phone}</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        {users?.loading &&
          <div className="d-flex justify-content-center mt-5">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        }
      </div>
    </div>
  );
}

export default UserList;
