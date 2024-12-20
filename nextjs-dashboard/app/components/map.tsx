'use client';

import React, { useState, useEffect } from 'react';
import {LocationDataRow, MetadataRow, queryFullOriData, queryFiltersProcessedDataLocationStatistics, queryProcessedData, queryLastUpdateTime, queryFullProcessedData} from '../helpers/db_helper'
import {FiltersType} from "../helpers/db_helper";
import {Map, AdvancedMarker, Pin} from '@vis.gl/react-google-maps';
import {type Marker, MarkerClusterer} from '@googlemaps/markerclusterer';

export const FreeFoodMap: React.FC<{ filters: FiltersType,  setFilters: React.Dispatch<React.SetStateAction<FiltersType>>}> = ( {filters, setFilters}) => {
    const [data, setData] = useState<LocationDataRow[]>([]);
    const [selectedMarkers, setSelectedMarkers] = useState<string[]>([]);
    const fetchData = async () => {
        try {
          const res = await fetch('/api/dataLocationStatistics', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(filters),
          });
    
          if (res.ok) {
            const data: LocationDataRow[] = await res.json();
            setData(data);
          } else {
            const errorData = await res.json();
            console.error('Error fetching location statistics', errorData);
          }
        } catch (error) {
          console.error('Error:', error);
        }
      };
    useEffect(() => {
        fetchData();
    }, [filters.daysOfWeek, filters.dateRange, filters.timeRange, filters.categories, filters.availableTimesToClearOnly, filters.timeToClear])

    const handleMarkerClick = (location: string) => {
      let updatedSelectedMarkers;
      if (selectedMarkers.includes(location)) {
        updatedSelectedMarkers = selectedMarkers.filter((loc) => loc !== location);
        
      }
      else {
        updatedSelectedMarkers = [...selectedMarkers, location];
      }
      setSelectedMarkers(updatedSelectedMarkers);
      setFilters(prevFilters => ({ ...prevFilters, locations: updatedSelectedMarkers }));
    };

    const containerStyle = {
        height: '80vh',
        width: '90vw',
    }
    const defaultMapCenter = {  // ntu
        lat: 1.3487,
        lng: 103.6830
    }

    const mapOptions : google.maps.MapOptions = {
        center: defaultMapCenter,
        zoom: 15.5,
        mapId: 'NTUFREEFOOD',
        gestureHandling: 'auto',
    };
    let label;
    return (
      <div className='mb-10 flex flex-col justify-center items-center'>
        <h1 className="text-3xl font-semibold text-center mt-16 mb-5">{`A Bird's Eye View of Free Food Events in NTU`}</h1>
        <Map
            mapId={'NTUFREEFOOD'}
            style={containerStyle}
            defaultCenter={defaultMapCenter}
            defaultZoom={15.5}
            disableDefaultUI={true}
        >
            {/* render markers for each location in the data */}
            {data.map((item, index) => (

                <AdvancedMarker 
                key={index}
                position={{lat: item.latitude, lng: item.longitude}}
                title={`${item.location}: ${item.location_counts}`}
                onClick={() => handleMarkerClick(item.location)}
                >
                <Pin
                  glyph={item.location_counts.toString()}
                  background={selectedMarkers.includes(item.location) ? '#0f9d58' : null}
                  borderColor={selectedMarkers.includes(item.location) ? '#006425' : null}
                  glyphColor="white"
                />
              </AdvancedMarker>
            ))}

        </Map>
        <p className='p-2 md:hidden'>Select map markers to also filter by location!</p>
      </div>
    );
}



