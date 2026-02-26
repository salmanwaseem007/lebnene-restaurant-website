import AccessControl "authorization/access-control";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";
import Map "mo:core/Map";
import Array "mo:core/Array";
import List "mo:core/List";
import Text "mo:core/Text";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Iter "mo:core/Iter";

actor {
  include MixinStorage();

  // Types
  type MenuPhoto = {
    id : Text;
    blob : Storage.ExternalBlob;
    name : Text;
    displayOrder : Nat;
  };

  public type UserProfile = {
    name : Text;
  };

  type ContactInfo = {
    restaurantName : Text;
    whatsappNumber : Text;
    email : Text;
  };

  // Menu Photos
  let menuPhotosES = Map.empty<Text, MenuPhoto>();
  let menuPhotosEN = Map.empty<Text, MenuPhoto>();

  // Contact Information
  var contactInfo : ?ContactInfo = ?{
    restaurantName = "Lebnene";
    whatsappNumber = "+34 664 88 95 35";
    email = "lebnene.streetfood@gmail.com";
  };

  // Access Control
  let accessControlState = AccessControl.initState();

  // User Profiles
  let userProfiles = Map.empty<Principal, UserProfile>();

  // Helper function to ensure displayOrder is consistent after deletions
  func renumberPhotos(photos : Map.Map<Text, MenuPhoto>) {
    let photoArray = photos.values().toArray().sort(
      func(a, b) {
        Nat.compare(a.displayOrder, b.displayOrder);
      }
    );

    var i = 0;
    for (photo in photoArray.values()) {
      let newPhoto = {
        photo with displayOrder = i;
      };
      photos.add(photo.id, newPhoto);
      i += 1;
    };
  };

  // ============================================
  // Access Control Functions
  // ============================================

  public shared ({ caller }) func initializeAccessControl() : async () {
    AccessControl.initialize(accessControlState, caller);
  };

  public query ({ caller }) func getCallerUserRole() : async AccessControl.UserRole {
    AccessControl.getUserRole(accessControlState, caller);
  };

  public shared ({ caller }) func assignCallerUserRole(user : Principal, role : AccessControl.UserRole) : async () {
    // Admin-only check happens inside AccessControl.assignRole
    AccessControl.assignRole(accessControlState, caller, user, role);
  };

  public query ({ caller }) func isCallerAdmin() : async Bool {
    AccessControl.isAdmin(accessControlState, caller);
  };

  // ============================================
  // User Profile Functions
  // ============================================

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    let role = AccessControl.getUserRole(accessControlState, caller);
    if (role != #admin and role != #user) {
      Runtime.trap("Unauthorized: Only authenticated users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    let role = AccessControl.getUserRole(accessControlState, caller);
    if (role != #admin and role != #user) {
      Runtime.trap("Unauthorized: Only authenticated users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // ============================================
  // Menu Photo Management - Spanish (Admin Only)
  // ============================================

  public shared ({ caller }) func addMenuPhotoES(id : Text, blob : Storage.ExternalBlob, name : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add menu photos");
    };
    let displayOrder = menuPhotosES.size();
    let photo : MenuPhoto = {
      id;
      blob;
      name;
      displayOrder;
    };
    menuPhotosES.add(id, photo);
  };

  public shared ({ caller }) func deleteMenuPhotoES(id : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete menu photos");
    };
    menuPhotosES.remove(id);
    renumberPhotos(menuPhotosES);
  };

  public shared ({ caller }) func addMenuPhotosES(photos : [{ id : Text; blob : Storage.ExternalBlob; name : Text }]) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add menu photos");
    };
    let startOrder = menuPhotosES.size();
    var currentOrder = startOrder;
    for (photo in photos.values()) {
      let photoWithOrder : MenuPhoto = {
        photo with displayOrder = currentOrder;
      };
      menuPhotosES.add(photo.id, photoWithOrder);
      currentOrder += 1;
    };
  };

  public shared ({ caller }) func reorderMenuPhotosES(newOrder : [Text]) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can reorder menu photos");
    };

    let allPhotos = menuPhotosES.values().toArray();
    let numberOfPhotos = allPhotos.size();

    if (newOrder.size() != numberOfPhotos) {
      Runtime.trap("Invalid reordering: newOrder array must include all photos");
    };

    var i = 0;
    for (id in newOrder.values()) {
      switch (menuPhotosES.get(id)) {
        case (?photo) {
          let updatedPhoto = {
            photo with displayOrder = i;
          };
          menuPhotosES.add(id, updatedPhoto);
        };
        case (null) {
          Runtime.trap("Photo with id " # id # " not found in ES collection");
        };
      };
      i += 1;
    };
  };

  // ============================================
  // Menu Photo Management - English (Admin Only)
  // ============================================

  public shared ({ caller }) func addMenuPhotoEN(id : Text, blob : Storage.ExternalBlob, name : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add menu photos");
    };
    let displayOrder = menuPhotosEN.size();
    let photo : MenuPhoto = {
      id;
      blob;
      name;
      displayOrder;
    };
    menuPhotosEN.add(id, photo);
  };

  public shared ({ caller }) func deleteMenuPhotoEN(id : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete menu photos");
    };
    menuPhotosEN.remove(id);
    renumberPhotos(menuPhotosEN);
  };

  public shared ({ caller }) func addMenuPhotosEN(photos : [{ id : Text; blob : Storage.ExternalBlob; name : Text }]) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add menu photos");
    };
    let startOrder = menuPhotosEN.size();
    var currentOrder = startOrder;
    for (photo in photos.values()) {
      let photoWithOrder : MenuPhoto = {
        photo with displayOrder = currentOrder;
      };
      menuPhotosEN.add(photo.id, photoWithOrder);
      currentOrder += 1;
    };
  };

  public shared ({ caller }) func reorderMenuPhotosEN(newOrder : [Text]) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can reorder menu photos");
    };

    let allPhotos = menuPhotosEN.values().toArray();
    let numberOfPhotos = allPhotos.size();

    if (newOrder.size() != numberOfPhotos) {
      Runtime.trap("Invalid reordering: newOrder array must include all photos");
    };

    var i = 0;
    for (id in newOrder.values()) {
      switch (menuPhotosEN.get(id)) {
        case (?photo) {
          let updatedPhoto = {
            photo with displayOrder = i;
          };
          menuPhotosEN.add(id, updatedPhoto);
        };
        case (null) {
          Runtime.trap("Photo with id " # id # " not found in EN collection");
        };
      };
      i += 1;
    };
  };

  // ============================================
  // Menu Photo Retrieval (Public - No Auth Required)
  // ============================================

  public query func getMenuPhotosES() : async [MenuPhoto] {
    menuPhotosES.values().toArray().sort(
      func(a, b) {
        Nat.compare(a.displayOrder, b.displayOrder);
      }
    );
  };

  public query func getMenuPhotosEN() : async [MenuPhoto] {
    menuPhotosEN.values().toArray().sort(
      func(a, b) {
        Nat.compare(a.displayOrder, b.displayOrder);
      }
    );
  };

  // ============================================
  // Contact Information Management
  // ============================================

  public shared ({ caller }) func updateContactInfo(newInfo : ContactInfo) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update contact information");
    };
    contactInfo := ?newInfo;
  };

  public query func getContactInfo() : async ?ContactInfo {
    contactInfo;
  };
};
