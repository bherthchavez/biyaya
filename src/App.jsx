import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Login from "./features/auth/Login";
import DashLayout from "./components/DashLayout";
import Welcome from "./features/auth/Welcome";
import UsersList from './features/users/UsersList'
import OrdersList from './features/orders/OrdersList'
import EditUser from "./features/users/EditUser";
import NewUserForm from "./features/users/NewUserForm";
import ItemsList from './features/items/ItemsList'
import EditItem from "./features/items/EditItem";
import NewItemForm from "./features/items/NewItemForm";
import Prefetch from "./features/auth/Prefetch";
import PersistLogin from './features/auth/PersistLogin';
import RequireAuth from "./features/auth/RequireAuth";
import { ROLES } from './config/roles'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Analytics } from "@vercel/analytics/react"
import POS from "./features/pos/POS";
import AccessDenied from "./components/AccessDenied";
import { POSProvider } from "./context/POSContext";
import Reports from "./features/reports/Reports";
import Landing from "./features/landing/Landing";
import SettingsMenu from "./features/settings/SettingsMenu";


function App() {


  return (
    <div className="h-full  w-full">
      <POSProvider >
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />

            {/* <Route path="login" element={<Login />} /> */}

            {/* Protected Routes */}
            <Route element={<PersistLogin />}>
              <Route element={<RequireAuth allowedRoles={[...Object.values(ROLES)]} />}>
                <Route element={<Prefetch />}>
                  <Route path="dashboard" element={<DashLayout />}>
                    <Route index element={<Welcome />} />

                    <Route element={<RequireAuth allowedRoles={[ROLES.Manager, ROLES.Admin]} />}>
                      <Route path="users">
                        <Route index element={<> <ToastContainer /> <UsersList /></>} />
                        <Route path=":id" element={<> <ToastContainer /><EditUser /> </>} />
                        <Route path="new" element={<> <ToastContainer /><NewUserForm /> </>} />
                      </Route>
                    </Route>
                    <Route element={<RequireAuth allowedRoles={[ROLES.Manager, ROLES.Admin]} />}>
                      <Route path="items">
                        <Route index element={<> <ToastContainer /> <ItemsList /></>} />
                        <Route path=":id" element={<> <ToastContainer /><EditItem /> </>} />
                        <Route path="new" element={<> <ToastContainer /><NewItemForm /> </>} />
                      </Route>
                    </Route>
                    <Route element={<RequireAuth allowedRoles={[ROLES.Manager, ROLES.Admin, ROLES.Employee]} />}>
                      <Route path="pos">
                        <Route index element={<> <ToastContainer /> <POS /></>} />
                      </Route>
                    </Route>
                    <Route element={<RequireAuth allowedRoles={[ROLES.Manager, ROLES.Admin, ROLES.Employee]} />}>
                      <Route path="access-denied">
                        <Route index element={<> <ToastContainer /> <AccessDenied /></>} />
                      </Route>
                    </Route>
                    <Route element={<RequireAuth allowedRoles={[ROLES.Manager, ROLES.Admin]} />}>
                      <Route path="orders">
                        <Route index element={<> <ToastContainer /> <OrdersList /></>} />
                        {/* <Route path=":id" element={<> <ToastContainer /><EditOrder /> </>} />
                      <Route path="new" element={<> <ToastContainer /><NewOrderForm /> </>} /> */}
                      </Route>
                    </Route>
                  </Route>{/* End Dashboard */}

                  <Route path="pos" element={<DashLayout />}>
                    <Route index element={<POS />} />
                    <Route path='*' element={<Navigate replace to="/" />} />
                  </Route>{/* End pos */}


                  <Route path="inventory" element={<DashLayout />}>
                    <Route index element={<ItemsList />} />
                    <Route path=":id" element={<EditItem /> } />
                    <Route path="new" element={<NewItemForm /> } />
                  </Route>{/* End inventory */}

                  <Route path="orders" element={<DashLayout />}>
                    <Route index element={ <OrdersList />} />
                  </Route>{/* End orders */}
                 
                  <Route path="reports" element={<DashLayout />}>
                    <Route index element={ <Reports />} />
                  </Route>{/* End orders */}

                  <Route path="settings/users" element={<DashLayout />}>
                    <Route index element={ <SettingsMenu />} />
                    <Route path=":id" element={<EditUser /> } />
                    <Route path="new" element={<NewUserForm /> } />
                  </Route>{/* End settings users */}
                  
                  <Route path="settings/shop" element={<DashLayout />}>
                    <Route index element={ <SettingsMenu />} />
                  </Route>{/* End settings shop */}

                </Route>
              </Route>
            </Route>{/* End Protected Routes */}

            <Route path='*' element={<Navigate replace to="/" />} />
          </Route>
        </Routes>
      </POSProvider>
      <Analytics />
    </div>
  );
}

export default App;

